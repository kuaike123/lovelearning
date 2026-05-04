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
    expect(response.body.voice).toBe('female_warm');
    expect(response.body.speechRate).toBe('normal');
    expect(response.body.narrationTone).toBe('清晰讲题');
    expect(response.body.coverTone).toBe('标准题解模板');
    expect(response.body.jobId).toEqual(expect.any(String));
  }, 30000);

  it('rejects unopened subjects with a controlled Chinese error', async () => {
    const response = await request(app.getHttpServer()).post('/jobs').send({
      subject: 'physics',
      sourceType: 'text',
      content: '\u8bb2\u89e3\u725b\u987f\u7b2c\u4e8c\u5b9a\u5f8b'
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('\u7269\u7406');
    expect(response.body.message).toContain('\u6682\u672a\u5f00\u653e');
  }, 30000);

  it('keeps model and output prompt metadata on the created job', async () => {
    const response = await request(app.getHttpServer()).post('/jobs').send({
      subject: 'math',
      sourceType: 'text',
      content: 'Solve equation: 2x + 3 = 11',
      generationPrompt: '\u8f93\u51fa\u7c7b\u578b\uff1aPPT\u3002\u8bf7\u751f\u6210\u8bfe\u4ef6\u9875\u7ed3\u6784\u3002',
      model: 'deep',
      outputType: 'ppt'
    });

    expect(response.status).toBe(201);
    expect(response.body.model).toBe('deep');
    expect(response.body.outputType).toBe('ppt');
    expect(response.body.generationPrompt).toContain('PPT');
    expect(response.body.problemText).toBe('Solve equation: 2x + 3 = 11');
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
    expect(response.body.voice).toEqual(expect.any(String));
    expect(response.body.speechRate).toEqual(expect.any(String));
    expect(response.body.narrationTone).toEqual(expect.any(String));
    expect(response.body.coverTone).toEqual(expect.any(String));
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

  it('deletes a job from the recent jobs list over HTTP', async () => {
    const created = await request(app.getHttpServer()).post('/jobs').send({
      subject: 'math',
      sourceType: 'text',
      taskName: 'delete-me',
      content: 'Solve equation: 2x + 3 = 11'
    });

    const deleted = await (request(app.getHttpServer()) as any).delete(`/jobs/${created.body.jobId}`).send({});
    const listed = await request(app.getHttpServer()).get('/jobs').send({});

    expect(deleted.status).toBe(200);
    expect(deleted.body).toEqual({deleted: true});
    expect(listed.body.jobs.some((job: {jobId: string}) => job.jobId === created.body.jobId)).toBe(false);
  }, 30000);

  it('regenerates a job from an existing job over HTTP', async () => {
    const created = await request(app.getHttpServer()).post('/jobs').send({
      subject: 'math',
      sourceType: 'text',
      taskName: 'regenerate-source',
      content: 'Solve equation: 2x + 3 = 11'
    });

    const regenerated = await request(app.getHttpServer()).post(`/jobs/${created.body.jobId}/regenerate`).send({});

    expect(regenerated.status).toBe(201);
    expect(regenerated.body).toMatchObject({
      status: 'queued',
      stage: 'queued',
      problemText: 'Solve equation: 2x + 3 = 11',
      taskName: 'regenerate-source（重新生成）'
    });
    expect(regenerated.body.jobId).not.toBe(created.body.jobId);
  }, 30000);

  it('generates artifacts for a quantity relation word problem', async () => {
    const created = await request(app.getHttpServer()).post('/jobs').send({
      subject: 'math',
      sourceType: 'text',
      content: '已知两数和为12，其中一个数是另一个数的2倍，求这两个数。'
    });

    const response = await waitForCompletedJob(app, created.body.jobId);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      jobId: created.body.jobId,
      status: 'completed',
      stage: 'done',
      voice: 'male_calm',
      speechRate: 'fast',
      narrationTone: '关系梳理',
      coverTone: '已知条件拆开讲',
      lessonPlanUrl: `http://localhost:3001/artifacts/jobs/${created.body.jobId}/lesson.json`
    });

    const lesson = JSON.parse(
      await readFile(join(getArtifactRoot(), 'jobs', created.body.jobId, 'lesson.json'), 'utf8')
    );
    const lessonText = JSON.stringify(lesson);

    expect(lesson.title).toContain('数量关系应用题');
    expect(lessonText).toContain('x + 2x = 12');
    expect(lessonText).toContain('2x = 8');
  }, 30000);

  it('eventually returns generated artifact URLs for a created job', async () => {
    const created = await request(app.getHttpServer()).post('/jobs').send({
      subject: 'math',
      sourceType: 'text',
      content: 'Solve equation: 2x + 3 = 11'
    });

    const response = await waitForCompletedJob(app, created.body.jobId);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      jobId: created.body.jobId,
      status: 'completed',
      stage: 'done',
      videoUrl: `http://localhost:3001/artifacts/jobs/${created.body.jobId}/output.mp4`,
      coverUrl: `http://localhost:3001/artifacts/jobs/${created.body.jobId}/cover.png`,
      subtitleUrl: `http://localhost:3001/artifacts/jobs/${created.body.jobId}/subtitles.srt`,
      lessonPlanUrl: `http://localhost:3001/artifacts/jobs/${created.body.jobId}/lesson.json`,
      narrationTone: '清晰讲题',
      coverTone: '标准题解模板'
    });

    const lesson = JSON.parse(
      await readFile(join(getArtifactRoot(), 'jobs', created.body.jobId, 'lesson.json'), 'utf8')
    );
    const lessonText = JSON.stringify(lesson);

    expect(lesson.steps.length).toBeGreaterThanOrEqual(5);
    expect(lessonText).toContain('x = 4');
  }, 30000);
});

const waitForCompletedJob = async (app: INestApplication, jobId: string) => {
  let response = await request(app.getHttpServer()).get(`/jobs/${jobId}`).send({});

  for (let attempt = 0; attempt < 50 && response.body.status !== 'completed'; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    response = await request(app.getHttpServer()).get(`/jobs/${jobId}`).send({});
  }

  return response;
};
