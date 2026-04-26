import 'reflect-metadata';

import type {INestApplication} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import request from 'supertest';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';

import {AppModule} from '../../apps/api/src/app.module';
import {getArtifactRoot} from '../../apps/api/src/artifacts/artifact-root';

describe('jobs api', () => {
  let app: INestApplication;
  let previousRenderMode: string | undefined;

  beforeAll(async () => {
    previousRenderMode = process.env.EDU_RENDER_MODE;
    process.env.EDU_RENDER_MODE = 'placeholder';
    app = await NestFactory.create(AppModule, {logger: false});
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();

    if (previousRenderMode === undefined) {
      delete process.env.EDU_RENDER_MODE;
    } else {
      process.env.EDU_RENDER_MODE = previousRenderMode;
    }
  });

  it('creates a job and returns an id over HTTP', async () => {
    const response = await request(app.getHttpServer()).post('/jobs').send({
      subject: 'math',
      sourceType: 'text',
      taskName: '初一方程例题讲解',
      content: 'Solve equation: 2x + 3 = 11'
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('queued');
    expect(response.body.stage).toBe('queued');
    expect(response.body.taskName).toBe('初一方程例题讲解');
    expect(response.body.jobId).toEqual(expect.any(String));
  }, 30000);

  it('returns a created job over HTTP', async () => {
    const created = await request(app.getHttpServer()).post('/jobs').send({
      subject: 'math',
      sourceType: 'text',
      content: 'Solve equation: 2x + 3 = 11'
    });

    const response = await request(app.getHttpServer()).get(`/jobs/${created.body.jobId}`).send({});

    expect(response.status).toBe(200);
    expect(response.body.jobId).toBe(created.body.jobId);
    expect(['queued', 'running', 'completed']).toContain(response.body.status);
  }, 30000);

  it('lists recently created jobs over HTTP', async () => {
    const first = await request(app.getHttpServer()).post('/jobs').send({
      subject: 'math',
      sourceType: 'text',
      content: '解方程：x + 1 = 2'
    });
    const second = await request(app.getHttpServer()).post('/jobs').send({
      subject: 'math',
      sourceType: 'text',
      content: '解方程：2x + 3 = 11'
    });

    const response = await request(app.getHttpServer()).get('/jobs').send({});

    expect(response.status).toBe(200);
    expect(response.body.jobs.slice(0, 2).map((job: {jobId: string}) => job.jobId)).toEqual([
      second.body.jobId,
      first.body.jobId
    ]);
    expect(response.body.jobs[0]).toMatchObject({
      jobId: second.body.jobId,
      status: expect.any(String),
      createdAt: expect.any(String),
      taskName: '解方程：2x + 3 = 11',
      problemText: '解方程：2x + 3 = 11'
    });
  }, 30000);

  it('eventually returns generated artifact URLs for a created job', async () => {
    const created = await request(app.getHttpServer()).post('/jobs').send({
      subject: 'math',
      sourceType: 'text',
      content: 'Solve equation: 2x + 3 = 11'
    });

    let response = await request(app.getHttpServer()).get(`/jobs/${created.body.jobId}`).send({});

    for (let attempt = 0; attempt < 10 && response.body.status !== 'completed'; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      response = await request(app.getHttpServer()).get(`/jobs/${created.body.jobId}`).send({});
    }

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      jobId: created.body.jobId,
      status: 'completed',
      stage: 'done',
      videoUrl: `http://localhost:3001/artifacts/jobs/${created.body.jobId}/output.mp4`,
      coverUrl: `http://localhost:3001/artifacts/jobs/${created.body.jobId}/cover.png`,
      subtitleUrl: `http://localhost:3001/artifacts/jobs/${created.body.jobId}/subtitles.srt`,
      lessonPlanUrl: `http://localhost:3001/artifacts/jobs/${created.body.jobId}/lesson.json`
    });

    const lesson = JSON.parse(
      await readFile(join(getArtifactRoot(), 'jobs', created.body.jobId, 'lesson.json'), 'utf8')
    );
    const lessonText = JSON.stringify(lesson);

    expect(lesson.steps.length).toBeGreaterThanOrEqual(5);
    expect(lessonText).toContain('x = 4');
  }, 30000);
});
