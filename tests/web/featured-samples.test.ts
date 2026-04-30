import {describe, expect, it} from 'vitest';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

import {
  buildFeaturedSampleGenerationHref,
  featuredSampleArraySchema,
  featuredSamples,
  filterFeaturedSamples,
  getFeaturedSampleNeighbors,
  getFeaturedSamplePosition,
  getRelatedFeaturedSamples,
  splitFeaturedSamples,
  sortFeaturedSamplesByRecommendation
} from '../../apps/web/src/app/featured-samples';
import {featuredSampleRecords} from '../../apps/web/src/app/featured-samples.data';
import {FeaturedSampleShowcase} from '../../apps/web/src/app/FeaturedSampleShowcase';

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

  it('derives previous and next neighbors for sample detail navigation', () => {
    expect(getFeaturedSampleNeighbors('linear-equation-basic')).toEqual({
      previous: featuredSamples[1],
      next: featuredSamples[1]
    });
    expect(getFeaturedSampleNeighbors('quantity-relation-word-problem')).toEqual({
      previous: featuredSamples[0],
      next: featuredSamples[0]
    });
  });

  it('derives stable page position metadata for sample detail pagination', () => {
    expect(getFeaturedSamplePosition('linear-equation-basic')).toEqual({
      current: featuredSamples[0],
      index: 0,
      pageLabel: '1 / 2',
      total: 2
    });
    expect(getFeaturedSamplePosition('quantity-relation-word-problem')).toEqual({
      current: featuredSamples[1],
      index: 1,
      pageLabel: '2 / 2',
      total: 2
    });
  });

  it('returns related samples excluding the current slug', () => {
    expect(getRelatedFeaturedSamples('linear-equation-basic').map((sample) => sample.slug)).toEqual([
      'quantity-relation-word-problem'
    ]);
  });

  it('renders a prominent sample preview flow before the library cards', () => {
    const html = renderToStaticMarkup(React.createElement(FeaturedSampleShowcase));

    expect(html).toContain('data-featured-stage="linear-equation-basic"');
    expect(html).toContain('data-featured-rail="sample-switcher"');
    expect(html).toContain('data-featured-nav="previous"');
    expect(html).toContain('data-featured-nav="next"');
    expect(html).toContain('data-featured-page="1 / 2"');
    expect(html).toContain('data-featured-dot="active"');
    expect(html).toContain('data-poster-cta="hero"');
    expect(html).toContain('\u5f53\u524d\u9884\u89c8\u6837\u7247');
    expect(html).toContain('\u5f53\u524d\u6837\u7247');
    expect(html).toContain('\u5207\u6362\u6837\u7247');
    expect(html).toContain('\u5c01\u9762\u9884\u89c8\u6d41');
    expect(html).toContain('\u65b9\u7a0b\u8bb2\u89e3');
    expect(html).toContain('\u8bb2\u5e08\u53e3\u64ad\u5356\u70b9');
    expect(html).toContain('\u7acb\u5373\u751f\u6210\u540c\u6b3e');
  });
});
