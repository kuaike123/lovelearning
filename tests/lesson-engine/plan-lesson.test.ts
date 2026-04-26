import {describe, expect, it, vi} from 'vitest';

import {planLesson} from '../../packages/lesson-engine/src/plan-lesson';

describe('planLesson', () => {
  it('returns a schema-valid lesson plan from model output', async () => {
    const generate = vi.fn().mockResolvedValue({
      title: 'One-variable equation',
      learningGoal: 'Solve a linear equation by isolating x',
      steps: [
        {
          id: 's1',
          stepType: 'show_problem',
          teachingGoal: 'Introduce the equation',
          narration: 'Let us read the equation first.',
          visualIntent: 'Show the original equation',
          keyText: ['2x + 3 = 11']
        }
      ]
    });

    const result = await planLesson(
      {
        subject: 'math',
        grade: 'junior',
        problemType: 'linear_equation_one_variable',
        difficulty: 'easy',
        originalText: 'Solve equation: 2x + 3 = 11',
        normalizedExpression: '2x + 3 = 11',
        isSupported: true,
        knowledgePoints: ['linear equation']
      },
      {generate}
    );

    expect(result.steps[0].stepType).toBe('show_problem');
  });
});
