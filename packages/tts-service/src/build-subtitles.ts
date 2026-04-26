export const buildSubtitles = (
  scenes: Array<{id: string; subtitle: string; durationSec: number}>
) => {
  let startMs = 0;

  return scenes.map((scene) => {
    const endMs = startMs + scene.durationSec * 1000;
    const entry = {id: scene.id, startMs, endMs, text: scene.subtitle};
    startMs = endMs;
    return entry;
  });
};
