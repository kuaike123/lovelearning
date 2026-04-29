import {createTtsProvider, resolveTtsProviderId, type TtsProviderId} from './tts-provider';

export type AudioMeta = {
  audioPath?: string;
  audioUrl: string;
  durationSec: number;
};

export type SynthesizeSceneAudioOptions = {
  mode?: 'mock' | 'placeholder_wav' | 'windows_sapi';
  outputDir?: string;
  provider?: TtsProviderId;
  publicBaseUrl?: string;
  voice?: 'female_warm' | 'female_clear' | 'male_calm';
  speechRate?: 'slow' | 'normal' | 'fast';
};

export const synthesizeSceneAudio = async (
  scene: {
    id: string;
    subtitle: string;
  },
  options: SynthesizeSceneAudioOptions = {}
): Promise<AudioMeta> => {
  const provider = createTtsProvider(resolveTtsProviderId(options));

  return provider.synthesize({
    id: scene.id,
    outputDir: options.outputDir,
    publicBaseUrl: options.publicBaseUrl,
    speechRate: options.speechRate,
    text: scene.subtitle,
    voice: options.voice
  });
};
