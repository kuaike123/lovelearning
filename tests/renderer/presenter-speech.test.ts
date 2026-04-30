import {describe, expect, it} from 'vitest';

import {buildPresenterSpeechWindows} from '../../packages/renderer/src/lib/presenter-speech';

describe('presenter speech windows', () => {
  it('builds sentence-level mouth movement windows with natural pauses', () => {
    expect(buildPresenterSpeechWindows('\u5148\u8bfb\u9898\u3002\u518d\u79fb\u9879\u3002\u6700\u540e\u603b\u7ed3\u3002')).toEqual([
      {start: 0.1, end: 0.33},
      {start: 0.39, end: 0.61},
      {start: 0.67, end: 0.9}
    ]);
  });

  it('keeps a single narration line active through the main teaching beat', () => {
    expect(buildPresenterSpeechWindows('\u4e24\u8fb9\u540c\u65f6\u51cf\u53bb 3')).toEqual([{start: 0.1, end: 0.9}]);
  });
});
