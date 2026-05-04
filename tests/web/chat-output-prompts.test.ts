import {describe, expect, it} from 'vitest';

import {buildGenerationPrompt} from '../../apps/web/src/app/chat-output-prompts';

describe('chat output prompts', () => {
  it('keeps the generated instruction separate from the raw problem content', () => {
    const prompt = buildGenerationPrompt({
      model: 'deep',
      outputType: 'ppt'
    });

    expect(prompt).toContain('模型策略');
    expect(prompt).toContain('更细致的教学拆解');
    expect(prompt).toContain('输出类型：PPT');
    expect(prompt).toContain('课件页');
    expect(prompt).not.toContain('2x + 3 = 11');
  });

  it('builds an exam-oriented prompt for worksheet output', () => {
    const prompt = buildGenerationPrompt({
      model: 'fast',
      outputType: 'exam'
    });

    expect(prompt).toContain('优先快速生成');
    expect(prompt).toContain('输出类型：试卷');
    expect(prompt).toContain('同类练习题');
  });
});
