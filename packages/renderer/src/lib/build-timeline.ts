export const buildTimeline = (
  scenes: Array<{id: string; durationSec: number}>,
  fps: number
) => {
  let from = 0;

  return scenes.map((scene) => {
    const durationInFrames = Math.round(scene.durationSec * fps);
    const entry = {id: scene.id, from, durationInFrames};
    from += durationInFrames;
    return entry;
  });
};
