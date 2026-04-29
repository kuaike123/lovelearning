import 'reflect-metadata';

import {NestFactory} from '@nestjs/core';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {extname, resolve, sep} from 'node:path';

import {AppModule} from './app.module';
import {getArtifactRoot} from './artifacts/artifact-root';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000']
  });
  const artifactRoot = getArtifactRoot();
  app.use('/artifacts', async (request: any, response: any, next: () => void) => {
    const rawPath = decodeURIComponent(String(request.url ?? '').split('?')[0]);
    const filePath = resolve(artifactRoot, `.${rawPath}`);

    if (filePath !== artifactRoot && !filePath.startsWith(`${artifactRoot}${sep}`)) {
      response.status(403).send('Forbidden');
      return;
    }

    try {
      const fileStat = await stat(filePath);

      if (!fileStat.isFile()) {
        next();
        return;
      }

      response.type(contentTypeFor(filePath));
      createReadStream(filePath).pipe(response);
    } catch {
      next();
    }
  });
  await app.listen(3001);
}

void bootstrap();

const contentTypeFor = (filePath: string) => {
  switch (extname(filePath).toLowerCase()) {
    case '.json':
      return 'application/json';
    case '.srt':
      return 'application/x-subrip';
    case '.mp4':
      return 'video/mp4';
    case '.png':
      return 'image/png';
    case '.wav':
      return 'audio/wav';
    default:
      return 'application/octet-stream';
  }
};
