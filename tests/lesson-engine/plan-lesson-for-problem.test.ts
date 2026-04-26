import {describe, expect, it} from 'vitest';

import {planLessonForProblem} from '../../packages/lesson-engine/src/plan-lesson-for-problem';

describe('planLessonForProblem', () => {
  it('dispatches linear equations to the equation planner', async () => {
    const plan = await planLessonForProblem({
      subject: 'math',
      grade: 'junior',
      problemType: 'linear_equation_one_variable',
      difficulty: 'easy',
      originalText: 'Solve equation: 2x + 3 = 11',
      normalizedExpression: '2x + 3 = 11',
      isSupported: true,
      knowledgePoints: ['linear equation']
    });

    expect(plan.title).toContain('2x + 3 = 11');
    expect(plan.steps.flatMap((step) => step.keyText ?? [])).toContain('x = 4');
  });

  it('dispatches quantity relation word problems to the quantity relation planner', async () => {
    const plan = await planLessonForProblem({
      subject: 'math',
      grade: 'junior',
      problemType: 'word_problem_quantity_relation',
      difficulty: 'easy',
      originalText:
        '\u5df2\u77e5\u4e24\u6570\u548c\u4e3a12\uff0c\u5176\u4e2d\u4e00\u4e2a\u6570\u662f\u53e6\u4e00\u4e2a\u6570\u76842\u500d\uff0c\u6c42\u8fd9\u4e24\u4e2a\u6570\u3002',
      normalizedExpression: 'x + 2x = 12',
      isSupported: true,
      knowledgePoints: ['\u6570\u91cf\u5173\u7cfb']
    });

    expect(plan.title).toContain('\u6570\u91cf\u5173\u7cfb\u5e94\u7528\u9898');
    expect(plan.steps.flatMap((step) => step.keyText ?? [])).toContain('2x = 8');
  });
});
