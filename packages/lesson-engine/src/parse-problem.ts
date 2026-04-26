import type {ParsedProblem, ProblemInput} from '../../shared-types/src';

const equationPattern = /^[0-9xX+\-*/\s=()]+$/;

export const parseProblem = async (input: ProblemInput): Promise<ParsedProblem> => {
  const raw = input.content.replace(/^solve equation:\s*/i, '').replace(/^解方程[:：]\s*/i, '').trim();
  const normalizedExpression = raw.replace(/\s+/g, ' ').trim();
  const supported = normalizedExpression.includes('=') && equationPattern.test(normalizedExpression);

  if (!supported) {
    return {
      subject: 'math',
      grade: 'junior',
      problemType: 'linear_equation_one_variable',
      difficulty: 'easy',
      originalText: input.content,
      normalizedExpression,
      isSupported: false,
      rejectionReason: '当前版本仅支持一元一次方程解析',
      knowledgePoints: []
    };
  }

  return {
    subject: 'math',
    grade: 'junior',
    problemType: 'linear_equation_one_variable',
    difficulty: 'easy',
    originalText: input.content,
    normalizedExpression,
    isSupported: true,
    knowledgePoints: ['一元一次方程', '等式性质', '化简']
  };
};
