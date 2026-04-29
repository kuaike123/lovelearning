import 'reflect-metadata';

import type {INestApplication} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import request from 'supertest';
import {afterAll, beforeAll, describe, expect, it} from 'vitest';

import {AppModule} from '../../apps/api/src/app.module';

describe('tts preview api', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, {logger: false});
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns a playable preview audio artifact url with strategy-aware preview copy', async () => {
    const response = await request(app.getHttpServer()).post('/tts/preview').send({
      text: '我们先来看这道方程题。',
      voice: 'female_warm',
      speechRate: 'slow',
      style: 'kids',
      targetDurationSec: 45
    });

    expect(response.status).toBe(201);
    expect(response.body.audioUrl).toContain('http://localhost:3001/artifacts/previews/');
    expect(response.body.audioUrl.endsWith('.wav') || response.body.audioUrl.endsWith('.mp3')).toBe(true);
    expect(response.body.durationSec).toBeGreaterThanOrEqual(3);
    expect(response.body.voice).toBe('female_warm');
    expect(response.body.speechRate).toBe('slow');
    expect(response.body.narrationTone).toBe('鼓励启发');
    expect(response.body.previewText).toContain('我们先来看这道方程题');
  }, 30000);
});
