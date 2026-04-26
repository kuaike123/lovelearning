import 'reflect-metadata';

import type {INestApplication} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import request from 'supertest';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';

import {AppModule} from '../../apps/api/src/app.module';

describe('api app shell', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, {logger: false});
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('shows a Chinese landing page at the API root', async () => {
    const response = await request(app.getHttpServer()).get('/').send({});

    expect(response.status).toBe(200);
    expect(response.text).toContain('\u6559\u80b2\u89c6\u9891\u751f\u6210 API');
    expect(response.text).toContain('http://localhost:3000/');
    expect(response.text).toContain('\u6253\u5f00\u4ea7\u54c1\u754c\u9762');
  });
});
