import {existsSync} from 'node:fs';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';

import {
  createTtsProvider,
  resolveTtsProviderId,
  type TtsProviderId
} from '../../packages/tts-service/src/tts-provider';

describe('tts provider registry', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map((dir) => rm(dir, {force: true, recursive: true})));
    tempDirs.length = 0;
  });

  it('resolves the requested provider id from explicit options before environment defaults', () => {
    expect(resolveTtsProviderId({provider: 'placeholder'})).toBe('placeholder');
    expect(resolveTtsProviderId({mode: 'mock'})).toBe('mock');
  });

  it('uses a placeholder provider for unsupported commercial provider ids until credentials are configured', async () => {
    const outputDir = await mkdtemp(join(tmpdir(), 'edu-tts-provider-'));
    tempDirs.push(outputDir);
    const provider = createTtsProvider('commercial_stub' as TtsProviderId);

    const audio = await provider.synthesize({
      id: 'scene-1',
      outputDir,
      speechRate: 'normal',
      text: '我们先来看这道方程题。',
      voice: 'female_warm'
    });

    expect(audio.audioPath).toBe(join(outputDir, 'scene-1.wav'));
    expect(audio.audioPath).toBeDefined();
    const audioPath = audio.audioPath as string;
    expect(existsSync(audioPath)).toBe(true);
    expect((await readFile(audioPath)).subarray(0, 4).toString('ascii')).toBe('RIFF');
  });

  it('uses real Windows speech output instead of the sine-wave fallback when SAPI is available', async () => {
    if (process.platform !== 'win32') {
      return;
    }

    const outputDir = await mkdtemp(join(tmpdir(), 'edu-tts-provider-'));
    tempDirs.push(outputDir);
    const provider = createTtsProvider('windows_sapi');

    const audio = await provider.synthesize({
      id: 'windows-scene-1',
      outputDir,
      speechRate: 'normal',
      text: '这是一次本地语音测试。',
      voice: 'female_warm'
    });

    const audioPath = audio.audioPath as string;
    const wav = await readFile(audioPath);
    const firstSamples = [];

    for (let offset = 44; offset < Math.min(wav.length, 44 + 40); offset += 2) {
      firstSamples.push(wav.readInt16LE(offset));
    }

    expect(wav.length).toBeGreaterThan(1000);
    expect(firstSamples).not.toEqual([0, 0, 0, 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 13, 14, 15, 15, 16, 16, 15]);
  });
});
