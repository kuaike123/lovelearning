export type AudioMeta = {
  audioUrl: string;
  durationSec: number;
};

export const synthesizeSceneAudio = async (scene: {
  id: string;
  subtitle: string;
}): Promise<AudioMeta> => {
  const estimatedDurationSec = Math.max(3, Math.ceil(scene.subtitle.split(/\s+/).length / 3));

  return {
    audioUrl: `mock://audio/${scene.id}.mp3`,
    durationSec: estimatedDurationSec
  };
};
