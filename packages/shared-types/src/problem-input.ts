import {z} from 'zod';

export const problemInputSchema = z.object({
  subject: z.literal('math'),
  grade: z.literal('junior').optional(),
  sourceType: z.literal('text'),
  taskName: z.string().trim().min(1).max(80).optional(),
  content: z.string().min(1),
  targetDurationSec: z.number().int().min(30).max(60).optional(),
  style: z.enum(['teacher', 'kids', 'exam']).optional(),
  voice: z.enum(['female_warm', 'female_clear', 'male_calm']).optional(),
  speechRate: z.enum(['slow', 'normal', 'fast']).optional()
});

export type ProblemInput = z.infer<typeof problemInputSchema>;
