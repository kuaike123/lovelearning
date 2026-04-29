export type VoiceOption = 'female_warm' | 'female_clear' | 'male_calm';
export type StyleOption = 'teacher' | 'kids' | 'exam';
export type SpeechRate = 'slow' | 'normal' | 'fast';

export type VoiceRecommendation = {
  voice: VoiceOption;
  speechRate: SpeechRate;
  narrationTone: string;
  coverTone: string;
  reason: string;
};

export const recommendVoicePreset = (input: {
  content: string;
  style: StyleOption;
  targetDurationSec: 30 | 45 | 60;
}): VoiceRecommendation => {
  const normalizedContent = input.content.replace(/\s+/g, '');
  const isQuantityStory = /应用题|数量关系|路程|行程|速度|工程|甲乙|相距|两数和为|和为|倍|倍数/.test(normalizedContent);
  const isVisualHeavy = /函数|图像|几何|坐标|面积|角/.test(normalizedContent);
  const isLongTeacherExplainer = input.style === 'teacher' && input.targetDurationSec === 60;

  if (input.style === 'exam') {
    return {
      voice: 'female_clear',
      speechRate: 'fast',
      narrationTone: '提分拆解',
      coverTone: '考点直入',
      reason: '提分向讲解更适合用清晰、利落的音色和更紧凑的节奏。'
    };
  }

  if (isQuantityStory) {
    return {
      voice: 'male_calm',
      speechRate: 'fast',
      narrationTone: '关系梳理',
      coverTone: '已知条件拆开讲',
      reason: '数量关系题信息点多，先用沉稳音色压住节奏，再用更快语速把条件梳理清楚。'
    };
  }

  if (isVisualHeavy || isLongTeacherExplainer) {
    return {
      voice: 'male_calm',
      speechRate: 'normal',
      narrationTone: '耐心铺垫',
      coverTone: '步骤展开更稳',
      reason: '信息量更大的题型，用沉稳音色会更耐听，也更适合按步骤慢慢展开。'
    };
  }

  if (input.style === 'kids') {
    return {
      voice: 'female_warm',
      speechRate: 'slow',
      narrationTone: '鼓励启发',
      coverTone: '像老师在身边带着学',
      reason: '启发式内容更适合亲和、鼓励感更强的老师声音和稍慢一点的讲解节奏。'
    };
  }

  return {
    voice: 'female_warm',
    speechRate: 'normal',
    narrationTone: '清晰讲题',
    coverTone: '标准题解模板',
    reason: '标准题解场景里，温柔女声更适合大多数初中讲解视频。'
  };
};
