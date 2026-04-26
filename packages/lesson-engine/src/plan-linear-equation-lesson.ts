import type {LessonPlan, ParsedProblem} from '../../shared-types/src';

type SolvedEquation = {
  coefficient: number;
  constant: number;
  result: number;
  solution: number;
};

export const planLinearEquationLesson = async (problem: ParsedProblem): Promise<LessonPlan> => {
  const solved = solveSimpleLinearEquation(problem.normalizedExpression);
  const original = problem.normalizedExpression;
  const withoutConstant = `${formatNumber(solved.coefficient)}x = ${formatNumber(solved.result)}`;
  const answer = `x = ${formatNumber(solved.solution)}`;

  return {
    title: `解方程：${original}`,
    hook: '解方程时要记住：等式两边做同样的运算，等式仍然成立。',
    learningGoal: '掌握一元一次方程的基本解法，学会一步步把 x 单独留下来。',
    summary: `最终答案是 ${answer}。`,
    commonMistakes: ['只改等式的一边，破坏等式平衡', '忘记最后还要除以 x 前面的系数'],
    steps: [
      {
        id: 'show-problem',
        stepType: 'show_problem',
        teachingGoal: '读题并识别方程',
        narration: `我们先看原方程 ${original}。目标是把 x 单独留在等号的一边。`,
        visualIntent: '展示原方程，并高亮含有 x 的项',
        keyText: [original],
        expectedDurationSec: 5,
        animationHint: 'highlight'
      },
      {
        id: 'subtract-constant',
        stepType: 'transform',
        teachingGoal: '消去常数项',
        narration: `第一步，两边同时减去 ${formatNumber(solved.constant)}，因为 ${formatNumber(
          solved.constant
        )} 是加在 x 这一项旁边的常数。`,
        visualIntent: '展示等式两边同时做相同的减法',
        keyText: [`${original}`, `两边同时减去 ${formatNumber(solved.constant)}`],
        expectedDurationSec: 7,
        animationHint: 'move'
      },
      {
        id: 'simplify',
        stepType: 'transform',
        teachingGoal: '化简等式两边',
        narration: `左边的常数项被抵消，右边变成 ${formatNumber(
          solved.result
        )}，所以得到 ${withoutConstant}。`,
        visualIntent: '划掉相互抵消的常数项，并显示化简后的方程',
        keyText: [withoutConstant],
        expectedDurationSec: 6,
        animationHint: 'replace'
      },
      {
        id: 'divide-coefficient',
        stepType: 'transform',
        teachingGoal: '让 x 单独留下',
        narration: `接着，两边同时除以 ${formatNumber(solved.coefficient)}，这样 x 就被单独留下来了。`,
        visualIntent: '展示等式两边同时除以 x 前面的系数',
        keyText: [`${withoutConstant}`, `两边同时除以 ${formatNumber(solved.coefficient)}`],
        expectedDurationSec: 7,
        animationHint: 'move'
      },
      {
        id: 'state-answer',
        stepType: 'summary',
        teachingGoal: '写出最终答案',
        narration: `完成除法后，答案就是 ${answer}。`,
        visualIntent: '用醒目的高亮展示最终答案',
        keyText: [answer],
        expectedDurationSec: 5,
        animationHint: 'highlight'
      },
      {
        id: 'check-answer',
        stepType: 'summary',
        teachingGoal: '代回原式检查',
        narration: `还可以把 ${formatNumber(solved.solution)} 代回原方程，快速检查答案是否正确。`,
        visualIntent: '把答案代回原方程，展示验算过程',
        keyText: [`${formatNumber(solved.coefficient)} x ${formatNumber(solved.solution)} + ${formatNumber(solved.constant)} = ${formatNumber(solved.coefficient * solved.solution + solved.constant)}`],
        expectedDurationSec: 5,
        animationHint: 'compare'
      }
    ]
  };
};

const solveSimpleLinearEquation = (expression: string): SolvedEquation => {
  const match = expression
    .replace(/\s+/g, '')
    .match(/^([+-]?\d*)[xX]([+-]\d+)=([+-]?\d+)$/);

  if (!match) {
    throw new Error(`Unsupported linear equation shape: ${expression}`);
  }

  const coefficient = parseCoefficient(match[1]);
  const constant = Number(match[2]);
  const rightSide = Number(match[3]);
  const result = rightSide - constant;
  const solution = result / coefficient;

  if (!Number.isFinite(solution)) {
    throw new Error(`Unsupported linear equation shape: ${expression}`);
  }

  return {coefficient, constant, result, solution};
};

const parseCoefficient = (raw: string) => {
  if (raw === '' || raw === '+') return 1;
  if (raw === '-') return -1;
  return Number(raw);
};

const formatNumber = (value: number) => {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
};
