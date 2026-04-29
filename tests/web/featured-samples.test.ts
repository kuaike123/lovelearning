import {describe, expect, it} from 'vitest';

import {
  buildFeaturedSampleGenerationHref,
  featuredSampleArraySchema,
  featuredSamples,
  filterFeaturedSamples,
  splitFeaturedSamples,
  sortFeaturedSamplesByRecommendation
} from '../../apps/web/src/app/featured-samples';
import {featuredSampleRecords} from '../../apps/web/src/app/featured-samples.data';

describe('featured sample filters', () => {
  it('validates the raw sample metadata and preserves stable slugs', () => {
    expect(featuredSampleArraySchema.parse(featuredSampleRecords).map((sample) => sample.slug)).toEqual([
      'linear-equation-basic',
      'quantity-relation-word-problem'
    ]);
    expect(featuredSamples.map((sample) => sample.slug)).toEqual([
      'linear-equation-basic',
      'quantity-relation-word-problem'
    ]);
    expect(featuredSamples.map((sample) => sample.speechRate)).toEqual(['slow', 'fast']);
    expect(featuredSamples.map((sample) => sample.posterKicker)).toEqual([
      '初一热门题型',
      '考点直入'
    ]);
  });

  it('filters samples by problem category and primary use case', () => {
    expect(
      filterFeaturedSamples(featuredSamples, {
        problemCategory: 'equation',
        useCase: 'all'
      }).map((sample) => sample.slug)
    ).toEqual(['linear-equation-basic']);

    expect(
      filterFeaturedSamples(featuredSamples, {
        problemCategory: 'all',
        useCase: 'homework'
      }).map((sample) => sample.slug)
    ).toEqual(['quantity-relation-word-problem']);
  });

  it('returns an empty result when no sample matches the selected combination', () => {
    expect(
      filterFeaturedSamples(featuredSamples, {
        problemCategory: 'equation',
        useCase: 'classroom'
      })
    ).toEqual([]);
  });

  it('sorts samples by recommendation score from high to low', () => {
    expect(sortFeaturedSamplesByRecommendation(featuredSamples).map((sample) => sample.slug)).toEqual([
      'linear-equation-basic',
      'quantity-relation-word-problem'
    ]);
  });

  it('separates featured samples from the full library', () => {
    const result = splitFeaturedSamples(featuredSamples);

    expect(result.featured.map((sample) => sample.slug)).toEqual(['linear-equation-basic']);
    expect(result.library.map((sample) => sample.slug)).toEqual([
      'linear-equation-basic',
      'quantity-relation-word-problem'
    ]);
  });

  it('builds generation links with strategy-derived voice defaults when metadata omits them', () => {
    const quantitySample = featuredSamples.find((sample) => sample.slug === 'quantity-relation-word-problem');

    expect(quantitySample).not.toBeUndefined();
    expect(buildFeaturedSampleGenerationHref(quantitySample!)).toContain('voice=female_clear');
    expect(buildFeaturedSampleGenerationHref(quantitySample!)).toContain('speechRate=fast');
  });
});
