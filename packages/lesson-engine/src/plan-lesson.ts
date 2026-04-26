import {type LessonPlan, type ParsedProblem} from '../../shared-types/src';

import {buildLessonPrompt} from './prompts/plan-lesson';
import {repairLessonPlan} from './repair-lesson-plan';

type GenerateFn = (prompt: string) => Promise<unknown>;

export const planLesson = async (
  problem: ParsedProblem,
  deps: {generate: GenerateFn}
): Promise<LessonPlan> => {
  const prompt = buildLessonPrompt(problem);
  const raw = await deps.generate(prompt);
  return repairLessonPlan(raw);
};
