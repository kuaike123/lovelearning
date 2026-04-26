import type {ParsedProblem, ProblemInput} from '../../shared-types/src';

import {parseProblemWithTemplates} from './problem-templates';

export const parseProblem = async (input: ProblemInput): Promise<ParsedProblem> => {
  const parsed = await parseProblemWithTemplates(input);

  if (parsed) {
    return parsed;
  }

  return {
    subject: 'math',
    grade: 'junior',
    problemType: 'linear_equation_one_variable',
    difficulty: 'easy',
    originalText: input.content,
    normalizedExpression: input.content.replace(/\s+/g, ' ').trim(),
    isSupported: false,
    rejectionReason:
      '\u5f53\u524d V1 \u652f\u6301\u4e00\u5143\u4e00\u6b21\u65b9\u7a0b\u548c\u6570\u91cf\u5173\u7cfb\u5e94\u7528\u9898\uff0c\u8bf7\u4ece\u9996\u9875\u793a\u4f8b\u9898\u5f00\u59cb\u5c1d\u8bd5\u3002',
    knowledgePoints: []
  };
};
