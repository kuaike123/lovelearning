import type {LessonPlan, ParsedProblem} from '../../shared-types/src';

type QuantityRelation = {
  multiplier: number;
  sum: number;
  baseValue: number;
  multipliedValue: number;
};

export const planQuantityRelationLesson = async (problem: ParsedProblem): Promise<LessonPlan> => {
  const relation = solveQuantityRelation(problem.normalizedExpression);
  const equation = `x + ${formatNumber(relation.multiplier)}x = ${formatNumber(relation.sum)}`;
  const combined = `${formatNumber(1 + relation.multiplier)}x = ${formatNumber(relation.sum)}`;
  const baseAnswer = `x = ${formatNumber(relation.baseValue)}`;
  const multipliedAnswer = `${formatNumber(relation.multiplier)}x = ${formatNumber(relation.multipliedValue)}`;

  return {
    title: `\u6570\u91cf\u5173\u7cfb\u5e94\u7528\u9898\uff1a\u4e24\u6570\u548c\u4e0e\u500d\u6570\u5173\u7cfb`,
    hook:
      '\u9047\u5230\u6570\u91cf\u5173\u7cfb\u5e94\u7528\u9898\uff0c\u5148\u627e\u201c\u548c\u201d\u548c\u201c\u500d\u6570\u201d\u8fd9\u4e24\u4e2a\u5173\u952e\u4fe1\u606f\u3002',
    learningGoal:
      '\u5b66\u4f1a\u7528\u8bbe\u672a\u77e5\u6570\u7684\u65b9\u6cd5\uff0c\u628a\u4e24\u6570\u548c\u4e0e\u500d\u6570\u5173\u7cfb\u8f6c\u6210\u4e00\u5143\u4e00\u6b21\u65b9\u7a0b\u3002',
    summary: `\u8fd9\u4e24\u4e2a\u6570\u662f ${formatNumber(relation.baseValue)} \u548c ${formatNumber(
      relation.multipliedValue
    )}\u3002`,
    commonMistakes: [
      '\u628a\u201c\u4e00\u4e2a\u6570\u662f\u53e6\u4e00\u4e2a\u6570\u7684\u51e0\u500d\u201d\u770b\u53cd',
      '\u53ea\u5199\u51fa\u500d\u6570\u5173\u7cfb\uff0c\u5fd8\u8bb0\u4f7f\u7528\u201c\u548c\u201d\u6765\u5217\u65b9\u7a0b'
    ],
    steps: [
      {
        id: 'read-relation',
        stepType: 'show_problem',
        teachingGoal: '\u8bfb\u51fa\u6570\u91cf\u5173\u7cfb',
        narration: `\u8fd9\u9053\u9898\u7684\u5173\u952e\u4fe1\u606f\u662f\uff1a\u4e24\u4e2a\u6570\u7684\u548c\u662f ${formatNumber(
          relation.sum
        )}\uff0c\u5176\u4e2d\u4e00\u4e2a\u6570\u662f\u53e6\u4e00\u4e2a\u6570\u7684 ${formatNumber(
          relation.multiplier
        )} \u500d\u3002`,
        visualIntent: '\u9ad8\u4eae\u201c\u548c\u201d\u548c\u201c\u500d\u6570\u201d\u4e24\u4e2a\u6761\u4ef6',
        keyText: [
          `\u548c = ${formatNumber(relation.sum)}`,
          `\u500d\u6570 = ${formatNumber(relation.multiplier)}`
        ],
        expectedDurationSec: 6,
        animationHint: 'highlight'
      },
      {
        id: 'define-unknown',
        stepType: 'transform',
        teachingGoal: '\u8bbe\u672a\u77e5\u6570',
        narration: `\u8bbe\u8f83\u5c0f\u7684\u6570\u4e3a x\uff0c\u90a3\u4e48\u8f83\u5927\u7684\u6570\u5c31\u662f ${formatNumber(
          relation.multiplier
        )}x\u3002`,
        visualIntent: '\u7528\u4e24\u4e2a\u6807\u7b7e\u5c55\u793a\u8f83\u5c0f\u6570\u548c\u8f83\u5927\u6570',
        keyText: ['\u8f83\u5c0f\u7684\u6570 = x', `\u8f83\u5927\u7684\u6570 = ${formatNumber(relation.multiplier)}x`],
        expectedDurationSec: 7,
        animationHint: 'replace'
      },
      {
        id: 'build-equation',
        stepType: 'transform',
        teachingGoal: '\u6839\u636e\u548c\u5217\u65b9\u7a0b',
        narration: `\u56e0\u4e3a\u4e24\u4e2a\u6570\u7684\u548c\u662f ${formatNumber(
          relation.sum
        )}\uff0c\u6240\u4ee5\u5217\u51fa\u65b9\u7a0b ${equation}\u3002`,
        visualIntent: '\u628a\u4e24\u4e2a\u6570\u76f8\u52a0\uff0c\u53f3\u8fb9\u5bf9\u5e94\u603b\u548c',
        keyText: [equation],
        expectedDurationSec: 7,
        animationHint: 'move'
      },
      {
        id: 'solve-equation',
        stepType: 'transform',
        teachingGoal: '\u5408\u5e76\u540c\u7c7b\u9879\u5e76\u6c42\u89e3',
        narration: `\u5408\u5e76\u5de6\u8fb9\u7684\u540c\u7c7b\u9879\uff0c\u5f97\u5230 ${combined}\uff0c\u518d\u6c42\u51fa ${baseAnswer}\u3002`,
        visualIntent: '\u5c55\u793a\u4ece\u5217\u5f0f\u5230\u6c42\u51fa x \u7684\u8fc7\u7a0b',
        keyText: [combined, baseAnswer],
        expectedDurationSec: 8,
        animationHint: 'replace'
      },
      {
        id: 'find-other-number',
        stepType: 'transform',
        teachingGoal: '\u6c42\u51fa\u53e6\u4e00\u4e2a\u6570',
        narration: `\u53e6\u4e00\u4e2a\u6570\u662f ${formatNumber(
          relation.multiplier
        )}x\uff0c\u4ee3\u5165 x \u7684\u503c\uff0c\u5f97\u5230 ${multipliedAnswer}\u3002`,
        visualIntent: '\u628a x \u7684\u503c\u4ee3\u5165\u500d\u6570\u5173\u7cfb',
        keyText: [multipliedAnswer],
        expectedDurationSec: 6,
        animationHint: 'highlight'
      },
      {
        id: 'state-answer',
        stepType: 'summary',
        teachingGoal: '\u56de\u7b54\u539f\u95ee\u9898',
        narration: `\u6240\u4ee5\uff0c\u8fd9\u4e24\u4e2a\u6570\u662f ${formatNumber(
          relation.baseValue
        )} \u548c ${formatNumber(relation.multipliedValue)}\u3002`,
        visualIntent: '\u9ad8\u4eae\u6700\u7ec8\u7b54\u6848',
        keyText: [
          `${formatNumber(relation.baseValue)} + ${formatNumber(relation.multipliedValue)} = ${formatNumber(
            relation.sum
          )}`,
          `${formatNumber(relation.multipliedValue)} = ${formatNumber(relation.multiplier)} \u00d7 ${formatNumber(
            relation.baseValue
          )}`
        ],
        expectedDurationSec: 6,
        animationHint: 'compare'
      }
    ]
  };
};

const solveQuantityRelation = (expression: string): QuantityRelation => {
  const match = expression.replace(/\s+/g, '').match(/^x\+(\d+)x=(\d+)$/);

  if (!match) {
    throw new Error(`Unsupported quantity relation shape: ${expression}`);
  }

  const multiplier = Number(match[1]);
  const sum = Number(match[2]);
  const baseValue = sum / (1 + multiplier);
  const multipliedValue = multiplier * baseValue;

  if (![multiplier, sum, baseValue, multipliedValue].every(Number.isFinite)) {
    throw new Error(`Unsupported quantity relation shape: ${expression}`);
  }

  return {multiplier, sum, baseValue, multipliedValue};
};

const formatNumber = (value: number) => {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
};
