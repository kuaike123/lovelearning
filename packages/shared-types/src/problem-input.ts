import {z} from 'zod';

export const subjectSchema = z.enum(['math', 'physics', 'english', 'chinese']);

export const problemInputSchema = z.object({
  subject: subjectSchema,
  grade: z.literal('junior').optional(),
  sourceType: z.literal('text'),
  taskName: z.string().trim().min(1).max(80).optional(),
  content: z.string().min(1),
  generationPrompt: z.string().trim().min(1).max(1200).optional(),
  model: z.enum(['standard', 'deep', 'fast']).optional(),
  outputType: z.enum(['video', 'ppt', 'lesson_plan', 'exam']).optional(),
  targetDurationSec: z.number().int().min(30).max(60).optional(),
  style: z.enum(['teacher', 'kids', 'exam']).optional(),
  voice: z.enum(['female_warm', 'female_clear', 'male_calm']).optional(),
  speechRate: z.enum(['slow', 'normal', 'fast']).optional()
});

export type ProblemInput = z.infer<typeof problemInputSchema>;
