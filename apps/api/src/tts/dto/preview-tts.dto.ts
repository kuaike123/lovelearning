import {z} from 'zod';

export const previewTtsDtoSchema = z.object({
  text: z.string().trim().min(1).max(200),
  voice: z.enum(['female_warm', 'female_clear', 'male_calm']).optional(),
  speechRate: z.enum(['slow', 'normal', 'fast']).optional()
});

export class PreviewTtsDto {
  static parse(input: unknown) {
    return previewTtsDtoSchema.parse(input);
  }
}
