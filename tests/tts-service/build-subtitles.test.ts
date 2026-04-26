import {describe, expect, it} from 'vitest';

import {buildSubtitles} from '../../packages/tts-service/src/build-subtitles';

describe('buildSubtitles', () => {
  it('creates sentence-level subtitle ranges from scene durations', () => {
    const subtitles = buildSubtitles([
      {id: 's1', subtitle: 'Read the equation.', durationSec: 4},
      {id: 's2', subtitle: 'Subtract 3 from both sides.', durationSec: 6}
    ]);

    expect(subtitles).toEqual([
      {id: 's1', startMs: 0, endMs: 4000, text: 'Read the equation.'},
      {id: 's2', startMs: 4000, endMs: 10000, text: 'Subtract 3 from both sides.'}
    ]);
  });
});
