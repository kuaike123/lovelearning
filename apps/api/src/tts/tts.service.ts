import {Injectable} from '@nestjs/common';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';

import {recommendVoicePreset} from '../../../../packages/shared-types/src';
import {synthesizeSceneAudio} from '../../../../packages/tts-service/src/synthesize-scene-audio';
import {getArtifactRoot} from '../artifacts/artifact-root';
import {PreviewTtsDto} from './dto/preview-tts.dto';

@Injectable()
export class TtsService {
  async preview(input: unknown) {
    const parsedInput = PreviewTtsDto.parse(input);
    const previewId = `preview-${randomUUID()}`;
    const recommendation = recommendVoicePreset({
      content: parsedInput.text,
      style: parsedInput.style ?? 'teacher',
      targetDurationSec: parsedInput.targetDurationSec ?? 45
    });
    const previewText = buildPreviewText(parsedInput.text, recommendation.narrationTone);
    const result = await synthesizeSceneAudio(
      {
        id: previewId,
        subtitle: previewText
      },
      {
        outputDir: join(getArtifactRoot(), 'previews'),
        publicBaseUrl: 'http://localhost:3001/artifacts/previews',
        voice: parsedInput.voice ?? recommendation.voice,
        speechRate: parsedInput.speechRate ?? recommendation.speechRate
      }
    );

    return {
      audioUrl: result.audioUrl,
      durationSec: result.durationSec,
      narrationTone: recommendation.narrationTone,
      previewText,
      voice: parsedInput.voice ?? recommendation.voice,
      speechRate: parsedInput.speechRate ?? recommendation.speechRate
    };
  }
}

const buildPreviewText = (text: string, tone: string) => {
  if (tone === '鼓励启发') {
    return `别着急，我们先一步一步来看。${text}`;
  }

  if (tone === '提分拆解') {
    return `这道题先抓考点，再快速拆开条件。${text}`;
  }

  if (tone === '关系梳理') {
    return `先把题目里的数量关系理顺，再开始列式。${text}`;
  }

  if (tone === '耐心铺垫') {
    return `先看清题目条件，再按顺序推进每一步。${text}`;
  }

  return text;
};
