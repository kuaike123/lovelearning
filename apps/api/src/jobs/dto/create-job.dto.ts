import {problemInputSchema} from '../../../../../packages/shared-types/src/problem-input';

export class CreateJobDto {
  subject!: 'math' | 'physics' | 'english' | 'chinese';
  sourceType!: 'text';
  content!: string;

  static parse(input: unknown) {
    return problemInputSchema.parse(input);
  }
}
