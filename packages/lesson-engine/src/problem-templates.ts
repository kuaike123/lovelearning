import type {LessonPlan, ParsedProblem, ProblemInput} from '../../shared-types/src';

import {planLinearEquationLesson} from './plan-linear-equation-lesson';
import {planQuantityRelationLesson} from './plan-quantity-relation-lesson';

export type ProblemTemplate = {
  id: ParsedProblem['problemType'];
  subject: ParsedProblem['subject'];
  label: string;
  description: string;
  examples: string[];
  parse: (input: ProblemInput) => ParsedProblem | null;
  plan: (problem: ParsedProblem) => Promise<LessonPlan>;
};

const equationPattern = /^[0-9xX+\-*/\s=()]+$/;

export const problemTemplates: ProblemTemplate[] = [
  {
    id: 'linear_equation_one_variable',
    subject: 'math',
    label: '\u4e00\u5143\u4e00\u6b21\u65b9\u7a0b',
    description:
      '\u652f\u6301\u7c7b\u4f3c\u201c\u89e3\u65b9\u7a0b\uff1a2x + 3 = 11\u201d\u7684\u57fa\u7840\u65b9\u7a0b\u8bb2\u89e3\u3002',
    examples: [
      '\u89e3\u65b9\u7a0b\uff1a2x + 3 = 11',
      '\u89e3\u65b9\u7a0b\uff1ax + 1 = 2',
      '\u89e3\u65b9\u7a0b\uff1a3x - 6 = 12'
    ],
    parse: parseLinearEquation,
    plan: planLinearEquationLesson
  },
  {
    id: 'word_problem_quantity_relation',
    subject: 'math',
    label: '\u6570\u91cf\u5173\u7cfb\u5e94\u7528\u9898',
    description:
      '\u652f\u6301\u4e24\u6570\u548c\u4e0e\u500d\u6570\u5173\u7cfb\u7684\u5e94\u7528\u9898\uff0c\u4f8b\u5982\u201c\u4e24\u6570\u548c\u4e3a12\uff0c\u4e00\u4e2a\u6570\u662f\u53e6\u4e00\u4e2a\u6570\u76842\u500d\u201d\u3002',
    examples: [
      '\u5df2\u77e5\u4e24\u6570\u548c\u4e3a12\uff0c\u5176\u4e2d\u4e00\u4e2a\u6570\u662f\u53e6\u4e00\u4e2a\u6570\u76842\u500d\uff0c\u6c42\u8fd9\u4e24\u4e2a\u6570\u3002'
    ],
    parse: parseQuantityRelationWordProblem,
    plan: planQuantityRelationLesson
  }
];

export const getProblemTemplates = () => problemTemplates;

export const getProblemTemplate = (id: string) => {
  return problemTemplates.find((template) => template.id === id) ?? null;
};

export const parseProblemWithTemplates = async (input: ProblemInput) => {
  for (const template of problemTemplates) {
    const parsed = template.parse(input);

    if (parsed) {
      return parsed;
    }
  }

  return null;
};

export const planLessonWithTemplates = async (problem: ParsedProblem) => {
  const template = getProblemTemplate(problem.problemType);

  if (!template) {
    throw new Error(`Unsupported problem template: ${problem.problemType}`);
  }

  return template.plan(problem);
};

function parseLinearEquation(input: ProblemInput): ParsedProblem | null {
  const raw = stripEquationPrefix(input.content).trim();
  const normalizedExpression = raw.replace(/\s+/g, ' ').trim();
  const supported = normalizedExpression.includes('=') && equationPattern.test(normalizedExpression);

  if (!supported) {
    return null;
  }

  return {
    subject: 'math',
    grade: 'junior',
    problemType: 'linear_equation_one_variable',
    difficulty: 'easy',
    originalText: input.content,
    normalizedExpression,
    isSupported: true,
    knowledgePoints: [
      '\u4e00\u5143\u4e00\u6b21\u65b9\u7a0b',
      '\u7b49\u5f0f\u6027\u8d28',
      '\u5316\u7b80'
    ]
  };
}

function parseQuantityRelationWordProblem(input: ProblemInput): ParsedProblem | null {
  const normalized = input.content.replace(/\s+/g, '');
  const match =
    normalized.match(
      /\u4e24\u6570\u548c\u4e3a(\d+).*\u4e00\u4e2a\u6570\u662f\u53e6\u4e00\u4e2a\u6570\u7684(\d+)\u500d/u
    ) ??
    normalized.match(
      /\u4e24\u4e2a\u6570\u7684\u548c\u662f(\d+).*\u4e00\u4e2a\u6570\u662f\u53e6\u4e00\u4e2a\u6570\u7684(\d+)\u500d/u
    );

  if (!match) return null;

  const sum = Number(match[1]);
  const multiplier = Number(match[2]);

  if (!Number.isFinite(sum) || !Number.isFinite(multiplier) || sum <= 0 || multiplier <= 0) {
    return null;
  }

  return {
    subject: 'math',
    grade: 'junior',
    problemType: 'word_problem_quantity_relation',
    difficulty: 'easy',
    originalText: input.content,
    normalizedExpression: `x + ${multiplier}x = ${sum}`,
    isSupported: true,
    knowledgePoints: [
      '\u6570\u91cf\u5173\u7cfb',
      '\u8bbe\u672a\u77e5\u6570',
      '\u5217\u4e00\u5143\u4e00\u6b21\u65b9\u7a0b'
    ]
  };
}

const stripEquationPrefix = (content: string) => {
  return content
    .replace(/^solve equation:\s*/i, '')
    .replace(/^\u89e3\u65b9\u7a0b\s*[:\uff1a]\s*/u, '');
};
