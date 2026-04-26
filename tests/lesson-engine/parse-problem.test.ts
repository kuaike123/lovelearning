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
      content: '解方程：3x + 4  = 11'
    });

    expect(parsed.isSupported).toBe(true);
    expect(parsed.normalizedExpression).toBe('3x + 4 = 11');
  });

  it('rejects unsupported free-form prompts', async () => {
    const parsed = await parseProblem({
      subject: 'math',
      sourceType: 'text',
      content: 'Explain the water cycle'
    });

    expect(parsed.problemType).toBe('linear_equation_one_variable');
    expect(parsed.subject).toBe('math');
    expect(parsed.grade).toBe('junior');
    expect(parsed.isSupported).toBe(false);
    expect(parsed.rejectionReason).toContain('仅支持一元一次方程');
  });
});
