import {describe, expect, it} from 'vitest';

import {lessonPlanSchema, problemInputSchema} from '../../packages/shared-types/src';

describe('problemInputSchema', () => {
  it('accepts the supported V1 request shape', () => {
    const parsed = problemInputSchema.parse({
      subject: 'math',
      grade: 'junior',
      sourceType: 'text',
      taskName: '\u521d\u4e00\u65b9\u7a0b\u4f8b\u9898\u8bb2\u89e3',
      content: 'Solve equation: 2x + 3 = 11',
      targetDurationSec: 45,
      style: 'teacher',
      voice: 'female_warm',
      speechRate: 'slow'
    });

    expect(parsed.content).toContain('2x + 3 = 11');
    expect(parsed.speechRate).toBe('slow');
    expect(parsed.taskName).toBe('\u521d\u4e00\u65b9\u7a0b\u4f8b\u9898\u8bb2\u89e3');
  });

  it('accepts future subject values at the input contract layer', () => {
    const parsed = problemInputSchema.parse({
      subject: 'physics',
      sourceType: 'text',
      content: '\u8bb2\u89e3\u725b\u987f\u7b2c\u4e8c\u5b9a\u5f8b'
    });

    expect(parsed.subject).toBe('physics');
  });

  it('accepts generation prompt metadata without changing the raw problem content', () => {
    const parsed = problemInputSchema.parse({
      subject: 'math',
      sourceType: 'text',
      content: 'Solve equation: 2x + 3 = 11',
      model: 'deep',
      outputType: 'ppt',
      generationPrompt: '输出类型：PPT。请生成课件页结构。'
    });

    expect(parsed.content).toBe('Solve equation: 2x + 3 = 11');
    expect(parsed.model).toBe('deep');
    expect(parsed.outputType).toBe('ppt');
    expect(parsed.generationPrompt).toContain('PPT');
  });
});

describe('lessonPlanSchema', () => {
  it('requires at least one lesson step', () => {
    expect(() =>
      lessonPlanSchema.parse({
        title: 'Equation lesson',
        learningGoal: 'Solve a linear equation',
        steps: []
      })
    ).toThrow(/at least 1/i);
  });
});
