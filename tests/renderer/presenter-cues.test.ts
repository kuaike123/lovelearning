import {describe, expect, it} from 'vitest';

import {getPresenterCueForScene} from '../../packages/renderer/src/lib/presenter-cues';

describe('presenter teaching cues', () => {
  it('maps visual layouts to reusable presenter teaching cues', () => {
    expect(getPresenterCueForScene({layout: 'formula_focus', sceneType: 'step'})).toBe('formula_pointer');
    expect(getPresenterCueForScene({layout: 'comparison', sceneType: 'warning'})).toBe('warning_flash');
    expect(getPresenterCueForScene({layout: 'summary', sceneType: 'summary'})).toBe('summary_reward');
    expect(getPresenterCueForScene({layout: 'problem_card', sceneType: 'problem'})).toBe('reading_guide');
    expect(getPresenterCueForScene({layout: 'diagram', sceneType: 'future_geometry'})).toBe('diagram_pointer');
  });
});
