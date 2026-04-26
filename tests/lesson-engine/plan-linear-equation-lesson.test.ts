import {describe, expect, it} from 'vitest';

import {planLinearEquationLesson} from '../../packages/lesson-engine/src/plan-linear-equation-lesson';

describe('planLinearEquationLesson', () => {
  it('builds a concrete step-by-step lesson for a supported equation', async () => {
    const plan = await planLinearEquationLesson({
      subject: 'math',
      grade: 'junior',
      problemType: 'linear_equation_one_variable',
      difficulty: 'easy',
      originalText: 'Solve equation: 2x + 3 = 11',
      normalizedExpression: '2x + 3 = 11',
      isSupported: true,
      knowledgePoints: ['linear equation']
    });

    const narration = plan.steps.map((step) => step.narration).join('\n');
    const keyText = plan.steps.flatMap((step) => step.keyText ?? []);

    expect(plan.steps.length).toBeGreaterThanOrEqual(5);
    expect(plan.title).toBe('解方程：2x + 3 = 11');
    expect(plan.learningGoal).toContain('一元一次方程');
    expect(narration).toContain('两边同时减去 3');
    expect(narration).toContain('两边同时除以 2');
    expect(keyText).toContain('x = 4');
    expect(plan.summary).toContain('最终答案是 x = 4');
  });

  it('rejects unsupported equation shapes explicitly', async () => {
    await expect(
      planLinearEquationLesson({
        subject: 'math',
        grade: 'junior',
        problemType: 'linear_equation_one_variable',
        difficulty: 'easy',
        originalText: 'Solve equation: x + 1 = x + 2',
        normalizedExpression: 'x + 1 = x + 2',
        isSupported: true,
        knowledgePoints: ['linear equation']
      })
    ).rejects.toThrow(/unsupported linear equation/i);
  });
});
