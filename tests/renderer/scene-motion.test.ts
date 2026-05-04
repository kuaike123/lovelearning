import {describe, expect, it} from 'vitest';

import {getMotionProfile} from '../../packages/renderer/src/lib/scene-motion';

describe('getMotionProfile', () => {
  it('gives compare scenes a stronger lateral motion profile', () => {
    const compare = getMotionProfile('compare', 0.4);
    const reveal = getMotionProfile('reveal', 0.4);

    expect(compare.translateX).not.toBe(0);
    expect(Math.abs(compare.translateX)).toBeGreaterThan(Math.abs(reveal.translateX));
    expect(compare.scale).toBeLessThan(reveal.scale);
    expect(Math.abs(compare.translateX)).toBeLessThanOrEqual(10);
    expect(Math.abs(compare.translateY)).toBeLessThanOrEqual(8);
  });

  it('gives emphasis scenes a stronger settle effect near the end', () => {
    const emphasis = getMotionProfile('emphasis', 0.9);
    const transform = getMotionProfile('transform', 0.9);

    expect(emphasis.scale).toBeGreaterThan(transform.scale);
    expect(emphasis.opacity).toBeGreaterThan(0.9);
    expect(Math.abs(transform.translateY)).toBeLessThanOrEqual(4);
  });
});
