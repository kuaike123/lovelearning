import {describe, expect, it} from 'vitest';

import {parseProblem} from '../../packages/lesson-engine/src/parse-problem';

describe('parseProblem', () => {
  it('classifies a supported linear equation', async () => {
    const parsed = await parseProblem({
      subject: 'math',
      sourceType: 'text',
      content: 'Solve equation: 2x + 3 = 11'
    });

    expect(parsed.problemType).toBe('linear_equation_one_variable');
    expect(parsed.subject).toBe('math');
    expect(parsed.grade).toBe('junior');
    expect(parsed.isSupported).toBe(true);
    expect(parsed.normalizedExpression).toBe('2x + 3 = 11');
  });

  it('classifies a Chinese linear equation prompt', async () => {
    const parsed = await parseProblem({
      subject: 'math',
      sourceType: 'text',
      content: '\u89e3\u65b9\u7a0b\uff1a3x + 4  = 11'
    });

    expect(parsed.isSupported).toBe(true);
    expect(parsed.problemType).toBe('linear_equation_one_variable');
    expect(parsed.normalizedExpression).toBe('3x + 4 = 11');
  });

  it('classifies a supported quantity relation word problem', async () => {
    const parsed = await parseProblem({
      subject: 'math',
      sourceType: 'text',
      content:
        '\u5df2\u77e5\u4e24\u6570\u548c\u4e3a11\uff0c\u5176\u4e2d\u4e00\u4e2a\u6570\u662f\u53e6\u4e00\u4e2a\u6570\u76842\u500d\uff0c\u6c42\u8fd9\u4e24\u4e2a\u6570\u3002'
    });

    expect(parsed.problemType).toBe('word_problem_quantity_relation');
    expect(parsed.isSupported).toBe(true);
    expect(parsed.normalizedExpression).toBe('x + 2x = 11');
    expect(parsed.knowledgePoints).toContain('\u6570\u91cf\u5173\u7cfb');
  });

  it('rejects unsupported free-form prompts with a Chinese reason', async () => {
    const parsed = await parseProblem({
      subject: 'math',
      sourceType: 'text',
      content: 'Explain the water cycle'
    });

    expect(parsed.problemType).toBe('linear_equation_one_variable');
    expect(parsed.subject).toBe('math');
    expect(parsed.grade).toBe('junior');
    expect(parsed.isSupported).toBe(false);
    expect(parsed.rejectionReason).toContain('\u5f53\u524d V1 \u652f\u6301');
  });
});
