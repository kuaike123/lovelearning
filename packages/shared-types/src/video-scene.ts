import {z} from 'zod';

export const videoSceneSchema = z.object({
  id: z.string().min(1),
  sceneType: z.enum(['title', 'problem', 'step', 'warning', 'summary']),
  durationSec: z.number().positive(),
  subtitle: z.string().min(1),
  audioUrl: z.string().optional(),
  transition: z.enum(['fade', 'slide', 'none']).optional(),
  props: z.record(z.string(), z.unknown())
});

export const videoProjectSchema = z.object({
  compositionId: z.literal('LessonVideo'),
  fps: z.literal(30),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  scenes: z.array(videoSceneSchema),
  totalDurationSec: z.number().positive(),
  theme: z.literal('clean_classroom')
});

export type VideoScene = z.infer<typeof videoSceneSchema>;
export type VideoProject = z.infer<typeof videoProjectSchema>;
