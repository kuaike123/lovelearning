export type MotionPreset = 'compare' | 'emphasis' | 'none' | 'reveal' | 'transform';

export type MotionProfile = {
  opacity: number;
  scale: number;
  translateX: number;
  translateY: number;
};

export const getMotionProfile = (preset: MotionPreset | undefined, progress: number): MotionProfile => {
  const safeProgress = Math.min(1, Math.max(0, progress));

  if (preset === 'compare') {
    return {
      opacity: clamp(0.45 + safeProgress * 0.85),
      scale: 0.95 + safeProgress * 0.04,
      translateX: (1 - safeProgress) * 26,
      translateY: (1 - safeProgress) * 16
    };
  }

  if (preset === 'emphasis') {
    const settle = safeProgress > 0.75 ? (safeProgress - 0.75) / 0.25 : 0;

    return {
      opacity: clamp(0.55 + safeProgress * 0.65),
      scale: 0.96 + settle * 0.06,
      translateX: 0,
      translateY: (1 - safeProgress) * 14
    };
  }

  if (preset === 'transform') {
    return {
      opacity: clamp(0.45 + safeProgress * 0.7),
      scale: 0.97 + safeProgress * 0.02,
      translateX: (1 - safeProgress) * 10,
      translateY: (1 - safeProgress) * 22
    };
  }

  if (preset === 'none') {
    return {
      opacity: 1,
      scale: 1,
      translateX: 0,
      translateY: 0
    };
  }

  return {
    opacity: clamp(0.5 + safeProgress * 0.6),
    scale: 0.98 + safeProgress * 0.01,
    translateX: 0,
    translateY: (1 - safeProgress) * 18
  };
};

const clamp = (value: number) => {
  return Math.min(1, Math.max(0, value));
};
