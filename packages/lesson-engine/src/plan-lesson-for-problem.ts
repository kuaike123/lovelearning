import type {LessonPlan, ParsedProblem} from '../../shared-types/src';

import {planLessonWithTemplates} from './problem-templates';

export const planLessonForProblem = async (problem: ParsedProblem): Promise<LessonPlan> => {
  return planLessonWithTemplates(problem);
};
