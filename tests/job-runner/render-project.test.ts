import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';

import {renderProject, resolveRenderScale} from '../../packages/job-runner/src/render-project';

let renderDir: string | null = null;

describe('renderProject', () => {
  afterEach(async () => {
    if (renderDir) {
      await rm(renderDir, {force: true, recursive: true});
      renderDir = null;
    }
  });

  it('writes local video and cover files for a project render', async () => {
    renderDir = await mkdtemp(join(tmpdir(), 'edu-video-render-'));

    const result = await renderProject(
      {
        compositionId: 'LessonVideo',
        fps: 30,
        width: 1080,
        height: 1920,
        theme: 'clean_classroom',
        totalDurationSec: 3,
        scenes: [
          {
            id: 'title',
            sceneType: 'title',
            durationSec: 3,
            subtitle: 'Equation lesson',
            props: {}
          }
        ]
      },
      {mode: 'placeholder', outputDir: renderDir}
    );

    const video = await readFile(result.videoPath, 'utf8');
    const cover = await readFile(result.coverPath);

    expect(result.videoPath).toBe(join(renderDir, 'output.mp4'));
    expect(result.coverPath).toBe(join(renderDir, 'cover.png'));
    expect(video).toContain('Equation lesson');
    expect(Array.from(cover.subarray(0, 8))).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  });

  it('defaults to full-resolution exports instead of low-scale preview rendering', () => {
    expect(resolveRenderScale({})).toBe(1);
  });
});
