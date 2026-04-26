import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {afterEach, describe, expect, it} from 'vitest';

import {storeArtifacts} from '../../packages/job-runner/src/store-artifacts';

let artifactRoot: string | null = null;
let renderDir: string | null = null;

describe('storeArtifacts', () => {
  afterEach(async () => {
    if (artifactRoot) {
      await rm(artifactRoot, {force: true, recursive: true});
      artifactRoot = null;
    }

    if (renderDir) {
      await rm(renderDir, {force: true, recursive: true});
      renderDir = null;
    }
  });

  it('writes lesson JSON, subtitles, video, and cover files for a job', async () => {
    artifactRoot = await mkdtemp(join(tmpdir(), 'edu-video-artifacts-'));
    renderDir = await mkdtemp(join(tmpdir(), 'edu-video-render-'));
    const videoPath = join(renderDir, 'output.mp4');
    const coverPath = join(renderDir, 'cover.png');

    await writeFile(videoPath, 'video bytes', 'utf8');
    await writeFile(coverPath, 'cover bytes', 'utf8');

    const result = await storeArtifacts({
      jobId: 'job-1',
      artifactRoot,
      publicBaseUrl: 'http://localhost:3001/artifacts',
      metadata: {
        problemText: '解方程：2x + 3 = 11',
        taskName: '初一方程例题讲解'
      },
      lessonPlan: {
        title: 'Equation lesson',
        learningGoal: 'Solve the equation',
        steps: [
          {
            id: 's1',
            stepType: 'show_problem',
            teachingGoal: 'Show problem',
            narration: 'Read the equation.',
            visualIntent: 'Display equation'
          }
        ]
      },
      subtitles: [{id: 's1', startMs: 0, endMs: 4000, text: 'Read the equation.'}],
      renderArtifact: {videoPath, coverPath}
    });

    const lesson = await readFile(join(artifactRoot, 'jobs', 'job-1', 'lesson.json'), 'utf8');
    const metadata = await readFile(join(artifactRoot, 'jobs', 'job-1', 'job.json'), 'utf8');
    const subtitles = await readFile(join(artifactRoot, 'jobs', 'job-1', 'subtitles.srt'), 'utf8');
    const video = await readFile(join(artifactRoot, 'jobs', 'job-1', 'output.mp4'), 'utf8');
    const cover = await readFile(join(artifactRoot, 'jobs', 'job-1', 'cover.png'), 'utf8');

    expect(JSON.parse(lesson).title).toBe('Equation lesson');
    expect(JSON.parse(metadata)).toMatchObject({
      problemText: '解方程：2x + 3 = 11',
      taskName: '初一方程例题讲解'
    });
    expect(subtitles).toContain('00:00:00,000 --> 00:00:04,000');
    expect(video).toBe('video bytes');
    expect(cover).toBe('cover bytes');
    expect(result).toEqual({
      videoUrl: 'http://localhost:3001/artifacts/jobs/job-1/output.mp4',
      coverUrl: 'http://localhost:3001/artifacts/jobs/job-1/cover.png',
      lessonPlanUrl: 'http://localhost:3001/artifacts/jobs/job-1/lesson.json',
      subtitleUrl: 'http://localhost:3001/artifacts/jobs/job-1/subtitles.srt'
    });
  });
});
