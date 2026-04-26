import {z} from 'zod';

export const jobStatusSchema = z.enum(['queued', 'running', 'completed', 'failed']);

export const jobResultSchema = z.object({
  jobId: z.string().min(1),
  status: jobStatusSchema,
  stage: z.string().min(1),
  error: z.string().optional(),
  videoUrl: z.string().optional(),
  coverUrl: z.string().optional(),
  subtitleUrl: z.string().optional(),
  lessonPlanUrl: z.string().optional()
});

export type JobStatus = z.infer<typeof jobStatusSchema>;
export type JobResult = z.infer<typeof jobResultSchema>;
