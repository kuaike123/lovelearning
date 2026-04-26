import 'reflect-metadata';

import type {INestApplication} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {mkdir, rm, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import request from 'supertest';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';

import {AppModule} from '../../apps/api/src/app.module';
import {getArtifactRoot} from '../../apps/api/src/artifacts/artifact-root';

describe('job artifact recovery', () => {
  let app: INestApplication;
  const jobId = 'recovered-job-1';
  const jobDir = join(getArtifactRoot(), 'jobs', jobId);

  beforeAll(async () => {
    await mkdir(jobDir, {recursive: true});
    await writeFile(join(jobDir, 'output.mp4'), 'video', 'utf8');
    await writeFile(join(jobDir, 'cover.png'), 'cover', 'utf8');
    await writeFile(join(jobDir, 'subtitles.srt'), '1\n00:00:00,000 --> 00:00:01,000\nHello', 'utf8');
    await writeFile(
      join(jobDir, 'job.json'),
      JSON.stringify({taskName: '初一方程例题讲解', problemText: '解方程：2x + 3 = 11'}),
      'utf8'
    );
    await writeFile(
      join(jobDir, 'lesson.json'),
      JSON.stringify({title: 'Solve 2x + 3 = 11', summary: 'The final answer is x = 4.'}),
      'utf8'
    );

    app = await NestFactory.create(AppModule, {logger: false});
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await rm(jobDir, {force: true, recursive: true});
  });

  it('returns completed job metadata reconstructed from artifact files', async () => {
    const response = await request(app.getHttpServer()).get(`/jobs/${jobId}`).send({});

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      jobId,
      status: 'completed',
      stage: 'done',
      taskName: '初一方程例题讲解',
      problemText: '解方程：2x + 3 = 11',
      videoUrl: `http://localhost:3001/artifacts/jobs/${jobId}/output.mp4`,
      coverUrl: `http://localhost:3001/artifacts/jobs/${jobId}/cover.png`,
      subtitleUrl: `http://localhost:3001/artifacts/jobs/${jobId}/subtitles.srt`,
      lessonPlanUrl: `http://localhost:3001/artifacts/jobs/${jobId}/lesson.json`
    });
  });

  it('includes recovered artifact jobs in the recent jobs list', async () => {
    const response = await request(app.getHttpServer()).get('/jobs').send({});

    expect(response.status).toBe(200);
    expect(response.body.jobs.some((job: {jobId: string}) => job.jobId === jobId)).toBe(true);
  });
});
