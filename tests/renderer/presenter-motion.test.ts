import {describe, expect, it} from 'vitest';

import {getPresenterFloatY} from '../../packages/renderer/src/components/PresenterMascot';

describe('presenter motion', () => {
  it('keeps mascot floating motion within a small stable range', () => {
    const samples = [0, 0.125, 0.25, 0.5, 0.75, 1].map((progress) => Math.abs(getPresenterFloatY(progress)));

    expect(Math.max(...samples)).toBeLessThanOrEqual(2);
  });
});
