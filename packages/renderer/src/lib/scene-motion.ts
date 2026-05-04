export type MotionPreset = 'compare' | 'emphasis' | 'none' | 'reveal' | 'transform' | 'elastic_entry';

export type MotionProfile = {
  opacity: number;
  scale: number;
  translateX: number;
  translateY: number;
  rotate: number;
};

/**
 * 实现更平滑的缓动函数
 * 基于 cubic-bezier 的物理模拟
 */
const easeOutBack = (x: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

const easeOutQuint = (x: number): number => {
  return 1 - Math.pow(1 - x, 5);
};

export const getMotionProfile = (preset: MotionPreset | undefined, progress: number): MotionProfile => {
  const safeProgress = Math.min(1, Math.max(0, progress));

  // 基础进入效果：淡入 + 缩放
  const entryProgress = Math.min(1, safeProgress * 2.5); // 在前 40% 的时间内完成进入
  const entryEase = easeOutBack(entryProgress);
  const quintEase = easeOutQuint(safeProgress);

  if (preset === 'compare') {
    return {
      opacity: clamp(entryProgress),
      scale: 0.95 + entryEase * 0.05,
      translateX: (1 - entryEase) * 20,
      translateY: 0,
      rotate: (1 - entryEase) * -1
    };
  }

  if (preset === 'emphasis') {
    // 强调效果：轻微抖动或呼吸感
    const pulse = Math.sin(safeProgress * Math.PI * 2) * 0.01;
    return {
      opacity: 1,
      scale: 1 + pulse,
      translateX: 0,
      translateY: 0,
      rotate: 0
    };
  }

  if (preset === 'transform') {
    // 推导过渡：平滑位移
    return {
      opacity: clamp(entryProgress),
      scale: 1,
      translateX: (1 - quintEase) * 30,
      translateY: 0,
      rotate: 0
    };
  }

  if (preset === 'elastic_entry') {
    return {
      opacity: clamp(entryProgress),
      scale: 0.8 + entryEase * 0.2,
      translateX: 0,
      translateY: (1 - entryEase) * 40,
      rotate: 0
    };
  }

  if (preset === 'none') {
    return {
      opacity: 1,
      scale: 1,
      translateX: 0,
      translateY: 0,
      rotate: 0
    };
  }

  // 默认：Reveal 效果
  return {
    opacity: clamp(entryProgress),
    scale: 0.98 + entryEase * 0.02,
    translateX: 0,
    translateY: (1 - entryEase) * 15,
    rotate: 0
  };
};

const clamp = (value: number) => {
  return Math.min(1, Math.max(0, value));
};
