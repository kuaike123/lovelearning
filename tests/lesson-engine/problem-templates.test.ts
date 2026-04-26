import {describe, expect, it} from 'vitest';

import {
  getProblemTemplate,
  getProblemTemplates,
  parseProblemWithTemplates,
  planLessonWithTemplates
} from '../../packages/lesson-engine/src/problem-templates';

describe('problem templates', () => {
  it('registers current problem types as unique template IDs', () => {
    const templates = getProblemTemplates();
    const ids = templates.map((template) => template.id);

    expect(ids).toEqual(['linear_equation_one_variable', 'word_problem_quantity_relation']);
    expect(new Set(ids).size).toBe(ids.length);
    expect(templates.every((template) => template.subject === 'math')).toBe(true);
    expect(templates.every((template) => template.examples.length > 0)).toBe(true);
  });

  it('finds templates by ID for planner dispatch', () => {
    const template = getProblemTemplate('word_problem_quantity_relation');

    expect(template?.label).toBe('\u6570\u91cf\u5173\u7cfb\u5e94\u7528\u9898');
    expect(getProblemTemplate('not_registered')).toBeNull();
  });

  it('parses supported problems by walking registered templates', async () => {
    const parsed = await parseProblemWithTemplates({
      subject: 'math',
      sourceType: 'text',
      content:
        '\u5df2\u77e5\u4e24\u6570\u548c\u4e3a12\uff0c\u5176\u4e2d\u4e00\u4e2a\u6570\u662f\u53e6\u4e00\u4e2a\u6570\u76842\u500d\uff0c\u6c42\u8fd9\u4e24\u4e2a\u6570\u3002'
    });

    expect(parsed?.problemType).toBe('word_problem_quantity_relation');
    expect(parsed?.normalizedExpression).toBe('x + 2x = 12');
  });

  it('plans lessons through the matching registered template', async () => {
    const plan = await planLessonWithTemplates({
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
