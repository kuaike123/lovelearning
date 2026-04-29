import {Injectable} from '@nestjs/common';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';

import {synthesizeSceneAudio} from '../../../../packages/tts-service/src/synthesize-scene-audio';
import {getArtifactRoot} from '../artifacts/artifact-root';
import {PreviewTtsDto} from './dto/preview-tts.dto';

@Injectable()
export class TtsService {
  async preview(input: unknown) {
    const parsedInput = PreviewTtsDto.parse(input);
    const previewId = `preview-${randomUUID()}`;
    const result = await synthesizeSceneAudio(
      {
        id: previewId,
        subtitle: parsedInput.text
      },
      {
        outputDir: join(getArtifactRoot(), 'previews'),
        publicBaseUrl: 'http://localhost:3001/artifacts/previews',
        voice: parsedInput.voice,
        speechRate: parsedInput.speechRate
      }
    );

    return {
      audioUrl: result.audioUrl,
      durationSec: result.durationSec,
      voice: parsedInput.voice ?? 'female_warm',
      speechRate: parsedInput.speechRate ?? 'normal'
    };
  }
}
