import {z} from 'zod';

export const parsedProblemSchema = z.object({
  subject: z.literal('math'),
  grade: z.literal('junior'),
  problemType: z.enum(['linear_equation_one_variable', 'word_problem_quantity_relation']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  originalText: z.string().min(1),
  normalizedExpression: z.string().min(1),
  isSupported: z.boolean(),
  rejectionReason: z.string().optional(),
  knowledgePoints: z.array(z.string())
});

export type ParsedProblem = z.infer<typeof parsedProblemSchema>;
