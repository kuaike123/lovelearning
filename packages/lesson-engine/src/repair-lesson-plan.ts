import {lessonPlanSchema, type LessonPlan} from '../../shared-types/src';

export const repairLessonPlan = (input: unknown): LessonPlan => {
  return lessonPlanSchema.parse(input);
};
