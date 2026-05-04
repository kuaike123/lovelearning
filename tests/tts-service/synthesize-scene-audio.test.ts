import {existsSync} from 'node:fs';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';

import {synthesizeSceneAudio} from '../../packages/tts-service/src/synthesize-scene-audio';

describe('synthesizeSceneAudio', () => {
  const tempDirs: string[] = [];

  afterEach(async () => {
    await Promise.all(tempDirs.map((dir) => rm(dir, {force: true, recursive: true})));
    tempDirs.length = 0;
  });

  it('writes a local wav file and returns renderable audio metadata', async () => {
    const outputDir = await mkdtemp(join(tmpdir(), 'edu-tts-test-'));
    tempDirs.push(outputDir);

    const audio = await synthesizeSceneAudio(
      {
        id: 's1',
        subtitle: '我们先来看这道方程题。'
      },
      {
        mode: 'placeholder_wav',
        outputDir,
        publicBaseUrl: 'http://localhost:3001/artifacts/jobs/job-1/audio'
      }
    );

    expect(audio.audioUrl).toBe('http://localhost:3001/artifacts/jobs/job-1/audio/s1.wav');
    expect(audio.audioPath).toBe(join(outputDir, 's1.wav'));
    expect(audio.audioPath).toBeDefined();
    const audioPath = audio.audioPath as string;
    expect(audio.durationSec).toBeGreaterThanOrEqual(3);
    expect(existsSync(audioPath)).toBe(true);
    expect((await readFile(audioPath)).subarray(0, 4).toString('ascii')).toBe('RIFF');
  });

  it('writes a silent fallback wav instead of an audible busy-tone placeholder', async () => {
    const outputDir = await mkdtemp(join(tmpdir(), 'edu-tts-test-'));
    tempDirs.push(outputDir);

    const audio = await synthesizeSceneAudio(
      {
        id: 'silent-fallback',
        subtitle: '这是一个静音占位测试'
      },
      {
        mode: 'placeholder_wav',
        outputDir
      }
    );

    const audioPath = audio.audioPath as string;
    const wav = await readFile(audioPath);
    const firstSamples = [];

    for (let offset = 44; offset < Math.min(wav.length, 44 + 160); offset += 2) {
      firstSamples.push(wav.readInt16LE(offset));
    }

    expect(firstSamples.every((sample) => sample === 0)).toBe(true);
  });

  it('uses the selected speech rate when estimating placeholder audio duration', async () => {
    const outputDir = await mkdtemp(join(tmpdir(), 'edu-tts-test-'));
    tempDirs.push(outputDir);
    const subtitle = '我们先来看这道方程题，然后一步一步求出答案。';

    const slowAudio = await synthesizeSceneAudio(
      {id: 'slow', subtitle},
      {mode: 'placeholder_wav', outputDir, speechRate: 'slow'}
    );
    const fastAudio = await synthesizeSceneAudio(
      {id: 'fast', subtitle},
      {mode: 'placeholder_wav', outputDir, speechRate: 'fast'}
    );

    expect(slowAudio.durationSec).toBeGreaterThan(fastAudio.durationSec);
  });
});
