import {z} from 'zod';

export const visualInstructionSchema = z.object({
  layout: z.enum(['title_card', 'problem_card', 'formula_focus', 'comparison', 'summary', 'diagram']),
  coverLayout: z.enum(['equation_focus', 'quantity_story']).optional(),
  eyebrow: z.string().min(1).optional(),
  primaryText: z.string().min(1).optional(),
  detail: z.string().min(1).optional(),
  formulaBlocks: z.array(z.string().min(1)).optional(),
  highlights: z.array(z.string().min(1)).optional(),
  answer: z.string().min(1).optional(),
  takeaway: z.string().min(1).optional(),
  mistake: z
    .object({
      wrong: z.string().min(1),
      correct: z.string().min(1),
      tip: z.string().min(1)
    })
    .optional(),
  motionPreset: z.enum(['reveal', 'transform', 'compare', 'emphasis', 'none']).optional()
});

export const videoSceneSchema = z.object({
  id: z.string().min(1),
  sceneType: z.enum(['title', 'problem', 'step', 'warning', 'summary']),
  durationSec: z.number().positive(),
  subtitle: z.string().min(1),
  audioUrl: z.string().optional(),
  transition: z.enum(['fade', 'slide', 'none']).optional(),
  visualInstruction: visualInstructionSchema.optional(),
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
export type VisualInstruction = z.infer<typeof visualInstructionSchema>;
