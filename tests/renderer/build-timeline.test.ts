import {describe, expect, it} from 'vitest';

import {buildTimeline} from '../../packages/renderer/src/lib/build-timeline';

describe('buildTimeline', () => {
  it('converts scene durations into frame ranges', () => {
    const timeline = buildTimeline(
      [
        {id: 'title', durationSec: 3},
        {id: 's1', durationSec: 7}
      ],
      30
    );

    expect(timeline).toEqual([
      {id: 'title', from: 0, durationInFrames: 90},
      {id: 's1', from: 90, durationInFrames: 210}
    ]);
  });
});
