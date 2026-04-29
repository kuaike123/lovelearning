import {execFile} from 'node:child_process';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {promisify} from 'node:util';

import type {AudioMeta, SynthesizeSceneAudioOptions} from './synthesize-scene-audio';

export type TtsProviderId = 'mock' | 'placeholder' | 'windows_sapi' | 'commercial_stub';

export type TtsProviderInput = {
  id: string;
  outputDir?: string;
  publicBaseUrl?: string;
  speechRate?: SynthesizeSceneAudioOptions['speechRate'];
  text: string;
  voice?: SynthesizeSceneAudioOptions['voice'];
};

export type TtsProvider = {
  id: TtsProviderId;
  synthesize: (input: TtsProviderInput) => Promise<AudioMeta>;
};

const execFileAsync = promisify(execFile);

export const resolveTtsProviderId = (options: Pick<SynthesizeSceneAudioOptions, 'mode' | 'provider'> = {}) => {
  if (options.provider) return options.provider;

  if (options.mode === 'mock') return 'mock';
  if (options.mode === 'windows_sapi') return 'windows_sapi';
  if (options.mode === 'placeholder_wav') return 'placeholder';

  const envProvider = process.env.EDU_TTS_PROVIDER;
  if (envProvider === 'mock' || envProvider === 'placeholder' || envProvider === 'windows_sapi') {
    return envProvider;
  }

  const envMode = process.env.EDU_TTS_MODE;
  if (envMode === 'mock') return 'mock';
  if (envMode === 'windows_sapi') return 'windows_sapi';
  if (envMode === 'placeholder_wav') return 'placeholder';

  if (process.platform === 'win32' && !process.env.VITEST) {
    return 'windows_sapi';
  }

  return 'placeholder';
};

export const createTtsProvider = (providerId: TtsProviderId): TtsProvider => {
  if (providerId === 'mock') return mockTtsProvider;
  if (providerId === 'windows_sapi') return windowsSapiTtsProvider;

  return placeholderTtsProvider;
};

const mockTtsProvider: TtsProvider = {
  id: 'mock',
  synthesize: async (input) => ({
    audioUrl: `mock://audio/${input.id}.mp3`,
    durationSec: estimateSpeechDurationSec(input.text, input.speechRate)
  })
};

const placeholderTtsProvider: TtsProvider = {
  id: 'placeholder',
  synthesize: async (input) => {
    const durationSec = estimateSpeechDurationSec(input.text, input.speechRate);

    if (!input.outputDir) {
      return {
        audioUrl: `mock://audio/${input.id}.mp3`,
        durationSec
      };
    }

    const {audioPath, filename} = await prepareWavTarget(input);
    await writePlaceholderWav(audioPath, durationSec);

    return {
      audioPath,
      audioUrl: buildAudioUrl(audioPath, filename, input.publicBaseUrl),
      durationSec
    };
  }
};

const windowsSapiTtsProvider: TtsProvider = {
  id: 'windows_sapi',
  synthesize: async (input) => {
    if (!input.outputDir) return mockTtsProvider.synthesize(input);

    const durationSec = estimateSpeechDurationSec(input.text, input.speechRate);
    const {audioPath, filename} = await prepareWavTarget(input);

    try {
      await synthesizeWithWindowsSapi(input.text, audioPath, input.voice, input.speechRate);
      const actualDurationSec = await readWavDurationSec(audioPath);

      return {
        audioPath,
        audioUrl: buildAudioUrl(audioPath, filename, input.publicBaseUrl),
        durationSec: Math.max(2, Math.ceil(actualDurationSec))
      };
    } catch {
      await writePlaceholderWav(audioPath, durationSec);

      return {
        audioPath,
        audioUrl: buildAudioUrl(audioPath, filename, input.publicBaseUrl),
        durationSec
      };
    }
  }
};

const prepareWavTarget = async (input: TtsProviderInput) => {
  const outputDir = input.outputDir ?? process.cwd();
  await mkdir(outputDir, {recursive: true});
  const filename = `${safeAudioId(input.id)}.wav`;

  return {
    audioPath: join(outputDir, filename),
    filename
  };
};

export const estimateSpeechDurationSec = (
  text: string,
  speechRate: SynthesizeSceneAudioOptions['speechRate']
) => {
  const cjkChars = text.match(/[\u4e00-\u9fff]/g)?.length ?? 0;
  const latinWords = text.trim().split(/\s+/).filter(Boolean).length;
  const estimated = cjkChars / 4.2 + latinWords / 2.6 + 0.8;
  const rateMultiplier = speechRate === 'slow' ? 1.25 : speechRate === 'fast' ? 0.82 : 1;

  return Math.max(3, Math.ceil(estimated * rateMultiplier));
};

const safeAudioId = (id: string) => {
  return id.replace(/[^a-zA-Z0-9_-]/g, '_') || 'scene';
};

const buildAudioUrl = (audioPath: string, filename: string, publicBaseUrl?: string) => {
  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/$/, '')}/${filename}`;
  }

  return pathToFileURL(audioPath).toString();
};

const synthesizeWithWindowsSapi = async (
  text: string,
  audioPath: string,
  voice: SynthesizeSceneAudioOptions['voice'],
  speechRate: SynthesizeSceneAudioOptions['speechRate']
) => {
  const voiceRate = voice === 'female_clear' ? 0 : voice === 'male_calm' ? -2 : -1;
  const speechRateOffset = speechRate === 'slow' ? -2 : speechRate === 'fast' ? 2 : 0;
  const rate = Math.max(-10, Math.min(10, voiceRate + speechRateOffset));
  const script = [
    'Add-Type -AssemblyName System.Speech',
    '$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer',
    `$synth.Rate = ${rate}`,
    '$synth.Volume = 100',
    '$preferredVoice = $env:EDU_TTS_SAPI_VOICE',
    'if ($preferredVoice) { try { $synth.SelectVoice($preferredVoice) } catch {} }',
    '$synth.SetOutputToWaveFile($args[0])',
    '$synth.Speak($args[1]) | Out-Null',
    '$synth.Dispose()'
  ].join('; ');

  await execFileAsync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script, audioPath, text], {
    windowsHide: true
  });
};

const writePlaceholderWav = async (audioPath: string, durationSec: number) => {
  const sampleRate = 24_000;
  const channels = 1;
  const bitsPerSample = 16;
  const sampleCount = Math.max(1, Math.ceil(durationSec * sampleRate));
  const dataSize = sampleCount * channels * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0, 'ascii');
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8, 'ascii');
  buffer.write('fmt ', 12, 'ascii');
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * channels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(channels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36, 'ascii');
  buffer.writeUInt32LE(dataSize, 40);

  for (let index = 0; index < sampleCount; index++) {
    const envelope = Math.min(1, index / 1200, (sampleCount - index) / 1200);
    const tone = Math.sin((index / sampleRate) * Math.PI * 2 * 440) * 1200 * envelope;
    buffer.writeInt16LE(Math.round(tone), 44 + index * 2);
  }

  await writeFile(audioPath, buffer);
};

const readWavDurationSec = async (audioPath: string) => {
  const buffer = await readFile(audioPath);
  const waveOffset = buffer.indexOf('WAVE', 0, 'ascii');
  const dataOffset = buffer.indexOf('data', 0, 'ascii');

  if (waveOffset !== 8 || dataOffset < 0) return 0;

  const byteRate = buffer.readUInt32LE(28);
  const dataSize = buffer.readUInt32LE(dataOffset + 4);

  if (byteRate <= 0) return 0;

  return dataSize / byteRate;
};
