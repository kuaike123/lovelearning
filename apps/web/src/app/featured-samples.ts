import {z} from 'zod';

import {featuredSampleRecords} from './featured-samples.data';
import {recommendVoicePreset} from './voice-recommendation';

const voiceOptionSchema = z.enum(['female_warm', 'female_clear', 'male_calm']);
const speechRateSchema = z.enum(['slow', 'normal', 'fast']);
const styleSchema = z.enum(['teacher', 'kids', 'exam']);
const durationSchema = z.union([z.literal(30), z.literal(45), z.literal(60)]);

export const featuredSampleSchema = z.object({
  primaryUseCase: z.enum(['recruitment', 'homework', 'classroom']),
  problemCategory: z.enum(['equation', 'word_problem']),
  conversionScenario: z.string().min(1),
  content: z.string().min(1),
  description: z.string().min(1),
  gradeBand: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
  isFeatured: z.boolean(),
  posterCaption: z.string().min(1),
  posterKicker: z.string().min(1),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  recommendationScore: z.number().int().min(0).max(100),
  slug: z.string().min(1),
  speechRate: speechRateSchema,
  style: styleSchema,
  targetDurationSec: durationSchema,
  taskName: z.string().min(1),
  title: z.string().min(1),
  useCases: z.array(z.string().min(1)).min(1),
  voice: voiceOptionSchema
});

export const rawFeaturedSampleSchema = featuredSampleSchema.extend({
  posterKicker: z.string().min(1).optional(),
  speechRate: speechRateSchema.optional(),
  voice: voiceOptionSchema.optional()
});

export const featuredSampleArraySchema = rawFeaturedSampleSchema.array();

export type FeaturedSample = z.infer<typeof featuredSampleSchema>;
type RawFeaturedSample = z.infer<typeof rawFeaturedSampleSchema>;

export type ProblemCategoryFilter = 'all' | FeaturedSample['problemCategory'];
export type UseCaseFilter = 'all' | FeaturedSample['primaryUseCase'];

const normalizeFeaturedSample = (sample: RawFeaturedSample): FeaturedSample => {
  const recommendation = recommendVoicePreset({
    content: sample.content,
    style: sample.style,
    targetDurationSec: sample.targetDurationSec
  });

  return {
    ...sample,
    posterKicker: sample.posterKicker ?? recommendation.coverTone,
    speechRate: sample.speechRate ?? recommendation.speechRate,
    voice: sample.voice ?? recommendation.voice
  };
};

export const featuredSamples: FeaturedSample[] = featuredSampleArraySchema
  .parse(featuredSampleRecords)
  .map(normalizeFeaturedSample);

export const getFeaturedSampleBySlug = (slug: string) => {
  return featuredSamples.find((sample) => sample.slug === slug) ?? null;
};

export const getFeaturedSampleNeighbors = (slug: string) => {
  const currentIndex = featuredSamples.findIndex((sample) => sample.slug === slug);

  if (currentIndex === -1 || featuredSamples.length === 0) {
    return {
      previous: null,
      next: null
    };
  }

  const previousIndex = (currentIndex - 1 + featuredSamples.length) % featuredSamples.length;
  const nextIndex = (currentIndex + 1) % featuredSamples.length;

  return {
    previous: featuredSamples[previousIndex],
    next: featuredSamples[nextIndex]
  };
};

export const getFeaturedSamplePosition = (slug: string) => {
  const currentIndex = featuredSamples.findIndex((sample) => sample.slug === slug);

  if (currentIndex === -1 || featuredSamples.length === 0) {
    return {
      current: null,
      index: -1,
      pageLabel: `0 / ${featuredSamples.length}`,
      total: featuredSamples.length
    };
  }

  return {
    current: featuredSamples[currentIndex],
    index: currentIndex,
    pageLabel: `${currentIndex + 1} / ${featuredSamples.length}`,
    total: featuredSamples.length
  };
};

export const getRelatedFeaturedSamples = (slug: string, limit = 2) => {
  const current = getFeaturedSampleBySlug(slug);

  if (!current) {
    return [];
  }

  return featuredSamples
    .filter((sample) => sample.slug !== slug)
    .sort((left, right) => {
      const leftScore =
        Number(left.problemCategory === current.problemCategory) * 2 +
        Number(left.primaryUseCase === current.primaryUseCase);
      const rightScore =
        Number(right.problemCategory === current.problemCategory) * 2 +
        Number(right.primaryUseCase === current.primaryUseCase);

      return rightScore - leftScore || right.recommendationScore - left.recommendationScore;
    })
    .slice(0, limit);
};

export const buildFeaturedSampleGenerationHref = (sample: FeaturedSample) => {
  const recommendation = recommendVoicePreset({
    content: sample.content,
    style: sample.style,
    targetDurationSec: sample.targetDurationSec
  });

  const params = new URLSearchParams({
    content: sample.content,
    style: sample.style,
    speechRate: sample.speechRate ?? recommendation.speechRate,
    targetDurationSec: String(sample.targetDurationSec),
    taskName: sample.taskName,
    voice: sample.voice ?? recommendation.voice
  });

  return `/?${params.toString()}`;
};

export const filterFeaturedSamples = (
  samples: FeaturedSample[],
  filters: {
    problemCategory: ProblemCategoryFilter;
    useCase: UseCaseFilter;
  }
) => {
  return samples.filter((sample) => {
    const categoryMatches =
      filters.problemCategory === 'all' || sample.problemCategory === filters.problemCategory;
    const useCaseMatches = filters.useCase === 'all' || sample.primaryUseCase === filters.useCase;

    return categoryMatches && useCaseMatches;
  });
};

export const sortFeaturedSamplesByRecommendation = (samples: FeaturedSample[]) => {
  return [...samples].sort((left, right) => right.recommendationScore - left.recommendationScore);
};

export const splitFeaturedSamples = (samples: FeaturedSample[]) => {
  const sorted = sortFeaturedSamplesByRecommendation(samples);

  return {
    featured: sorted.filter((sample) => sample.isFeatured),
    library: sorted
  };
};
