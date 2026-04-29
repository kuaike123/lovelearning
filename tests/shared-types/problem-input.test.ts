import {describe, expect, it} from 'vitest';

import {lessonPlanSchema, problemInputSchema} from '../../packages/shared-types/src';

describe('problemInputSchema', () => {
  it('accepts the supported V1 request shape', () => {
    const parsed = problemInputSchema.parse({
      subject: 'math',
      grade: 'junior',
      sourceType: 'text',
      taskName: '初一方程例题讲解',
      content: 'Solve equation: 2x + 3 = 11',
      targetDurationSec: 45,
      style: 'teacher',
      voice: 'female_warm',
      speechRate: 'slow'
    });

    expect(parsed.content).toContain('2x + 3 = 11');
    expect(parsed.speechRate).toBe('slow');
    expect(parsed.taskName).toBe('初一方程例题讲解');
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
