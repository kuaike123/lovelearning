import type {ParsedProblem} from '../../../shared-types/src';

export const buildLessonPrompt = (problem: ParsedProblem) => `
你正在为中国大陆初中数学课堂生成讲解视频脚本。
只返回 JSON，不要输出 Markdown。
题目：${problem.normalizedExpression}
所有 title、learningGoal、summary、narration、teachingGoal、visualIntent 必须使用简体中文。
允许的 stepType：show_problem, transform, warn_mistake, summary。
`;
