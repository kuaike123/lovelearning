import {describe, expect, it} from 'vitest';

import {recommendVoicePreset} from '../../apps/web/src/app/voice-recommendation';

describe('recommendVoicePreset', () => {
  it('prefers a clear female voice for exam-style requests', () => {
    expect(
      recommendVoicePreset({
        content: '已知两数和为12，其中一个数是另一个数的2倍，求这两个数。',
        style: 'exam',
        targetDurationSec: 60
      })
    ).toMatchObject({
      voice: 'female_clear',
      speechRate: 'fast',
      narrationTone: '提分拆解'
    });
  });

  it('prefers a calm male voice for longer teacher explainers', () => {
    expect(
      recommendVoicePreset({
        content: '解方程：2x + 3 = 11',
        style: 'teacher',
        targetDurationSec: 60
      })
    ).toMatchObject({
      voice: 'male_calm',
      speechRate: 'normal',
      narrationTone: '耐心铺垫'
    });
  });

  it('keeps a warm female voice for approachable classroom content', () => {
    expect(
      recommendVoicePreset({
        content: '解方程：2x + 3 = 11',
        style: 'kids',
        targetDurationSec: 45
      })
    ).toMatchObject({
      voice: 'female_warm',
      speechRate: 'slow',
      narrationTone: '鼓励启发'
    });
  });

  it('raises the pacing for quantity-relation style content', () => {
    expect(
      recommendVoicePreset({
        content: '应用题：甲乙两地相距240千米，一辆车从甲地开往乙地，求速度关系。',
        style: 'teacher',
        targetDurationSec: 45
      })
    ).toMatchObject({
      voice: 'male_calm',
      speechRate: 'fast',
      narrationTone: '关系梳理'
    });
  });
});
