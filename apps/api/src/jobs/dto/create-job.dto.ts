import {problemInputSchema} from '../../../../../packages/shared-types/src/problem-input';

export class CreateJobDto {
  subject!: 'math';
  sourceType!: 'text';
  content!: string;

  static parse(input: unknown) {
    return problemInputSchema.parse(input);
  }
}
