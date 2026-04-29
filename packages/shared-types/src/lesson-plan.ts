import {z} from 'zod';

export const lessonStepSchema = z.object({
  id: z.string().min(1),
  stepType: z.enum(['show_problem', 'transform', 'warn_mistake', 'summary']),
  teachingGoal: z.string().min(1),
  narration: z.string().min(1),
  visualIntent: z.string().min(1),
  keyText: z.array(z.string()).optional(),
  expectedDurationSec: z.number().positive().optional(),
  animationHint: z.enum(['highlight', 'replace', 'move', 'compare']).optional()
});

export const lessonPlanSchema = z.object({
  title: z.string().min(1),
  hook: z.string().optional(),
  learningGoal: z.string().min(1),
  presentation: z
    .object({
      coverTone: z.string().min(1),
      narrationTone: z.string().min(1),
      coverLayout: z.enum(['equation_focus', 'quantity_story']).optional()
    })
    .optional(),
  summary: z.string().optional(),
  steps: z.array(lessonStepSchema).min(1),
  commonMistakes: z.array(z.string()).optional()
});

export type LessonStep = z.infer<typeof lessonStepSchema>;
export type LessonPlan = z.infer<typeof lessonPlanSchema>;
