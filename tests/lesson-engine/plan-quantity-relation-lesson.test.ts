import {describe, expect, it} from 'vitest';

import {planQuantityRelationLesson} from '../../packages/lesson-engine/src/plan-quantity-relation-lesson';

describe('planQuantityRelationLesson', () => {
  it('builds a concrete lesson for a supported quantity relation word problem', async () => {
    const plan = await planQuantityRelationLesson({
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

    const narration = plan.steps.map((step) => step.narration).join('\n');
    const keyText = plan.steps.flatMap((step) => step.keyText ?? []);

    expect(plan.title).toContain('\u6570\u91cf\u5173\u7cfb\u5e94\u7528\u9898');
    expect(plan.learningGoal).toContain('\u8bbe\u672a\u77e5\u6570');
    expect(plan.steps.length).toBeGreaterThanOrEqual(5);
    expect(narration).toContain('\u8bbe\u8f83\u5c0f\u7684\u6570\u4e3a x');
    expect(narration).toContain('\u5217\u51fa\u65b9\u7a0b x + 2x = 12');
    expect(keyText).toContain('x = 4');
    expect(keyText).toContain('2x = 8');
    expect(plan.summary).toContain('\u8fd9\u4e24\u4e2a\u6570\u662f 4 \u548c 8');
  });

  it('rejects unsupported quantity relation equations explicitly', async () => {
    await expect(
      planQuantityRelationLesson({
        subject: 'math',
        grade: 'junior',
        problemType: 'word_problem_quantity_relation',
        difficulty: 'easy',
        originalText: 'unsupported',
        normalizedExpression: 'x + y = 12',
        isSupported: true,
        knowledgePoints: ['\u6570\u91cf\u5173\u7cfb']
      })
    ).rejects.toThrow(/unsupported quantity relation/i);
  });
});
