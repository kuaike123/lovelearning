'use client';

import React, {useEffect, useMemo, useRef, useState} from 'react';

import {
  buildFeaturedSampleGenerationHref,
  featuredSamples,
  filterFeaturedSamples,
  splitFeaturedSamples,
  sortFeaturedSamplesByRecommendation,
  type FeaturedSample,
  type ProblemCategoryFilter,
  type UseCaseFilter
} from './featured-samples';
import {FeaturedSamplePoster} from './FeaturedSamplePoster';
import {createButtonStyle, createCardStyle, createPillStyle} from './ui-primitives';

const categoryOptions: {label: string; value: ProblemCategoryFilter}[] = [
  {label: '\u5168\u90e8', value: 'all'},
  {label: '\u65b9\u7a0b', value: 'equation'},
  {label: '\u5e94\u7528\u9898', value: 'word_problem'}
];

const useCaseOptions: {label: string; value: UseCaseFilter}[] = [
  {label: '\u5168\u90e8', value: 'all'},
  {label: '\u62db\u751f', value: 'recruitment'},
  {label: '\u9519\u9898', value: 'homework'},
  {label: '\u8bfe\u5802', value: 'classroom'}
];

export function FeaturedSampleShowcase() {
  const [problemCategory, setProblemCategory] = useState<ProblemCategoryFilter>('all');
  const [useCase, setUseCase] = useState<UseCaseFilter>('all');
  const thumbnailRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const visibleSamples = useMemo(
    () =>
      sortFeaturedSamplesByRecommendation(
        filterFeaturedSamples(featuredSamples, {problemCategory, useCase})
      ),
    [problemCategory, useCase]
  );
  const groupedSamples = splitFeaturedSamples(visibleSamples);
  const [activeSampleSlug, setActiveSampleSlug] = useState<string | null>(visibleSamples[0]?.slug ?? null);

  useEffect(() => {
    if (visibleSamples.length === 0) {
      setActiveSampleSlug(null);
      return;
    }

    if (!visibleSamples.some((sample) => sample.slug === activeSampleSlug)) {
      setActiveSampleSlug(visibleSamples[0].slug);
    }
  }, [activeSampleSlug, visibleSamples]);

  useEffect(() => {
    if (!activeSampleSlug) {
      return;
    }

    thumbnailRefs.current[activeSampleSlug]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }, [activeSampleSlug]);

  const activeSample =
    visibleSamples.find((sample) => sample.slug === activeSampleSlug) ?? visibleSamples[0] ?? null;
  const activeSampleIndex = activeSample
    ? visibleSamples.findIndex((sample) => sample.slug === activeSample.slug)
    : -1;
  const activeSamplePage =
    activeSampleIndex >= 0 ? `${activeSampleIndex + 1} / ${visibleSamples.length}` : `0 / ${visibleSamples.length}`;
  const resultSummary =
    visibleSamples.length > 0
      ? `\u5f53\u524d\u5171 ${visibleSamples.length} \u4e2a\u6837\u7247`
      : '\u6ca1\u6709\u627e\u5230\u5339\u914d\u7684\u6837\u7247';

  const jumpToRelativeSample = (direction: -1 | 1) => {
    if (visibleSamples.length === 0 || activeSampleIndex < 0) {
      return;
    }

    const nextIndex = (activeSampleIndex + direction + visibleSamples.length) % visibleSamples.length;
    setActiveSampleSlug(visibleSamples[nextIndex].slug);
  };

  return (
    <section id="featured-samples" style={sectionStyle}>
      <div style={headerStyle}>
        <p style={eyebrowStyle}>{'\u7cbe\u9009\u6837\u7247'}</p>
        <h2 style={titleStyle}>{'\u7cbe\u9009\u6837\u7247\u5e93'}</h2>
        <p style={descriptionStyle}>
          {
            '\u4e3a\u6f14\u793a\u3001\u6c47\u62a5\u548c\u62db\u751f\u573a\u666f\u51c6\u5907\u7684\u6807\u51c6 demo\uff0c\u4e00\u952e\u5e26\u5165\u9898\u76ee\u3001\u4efb\u52a1\u540d\u79f0\u3001\u65f6\u957f\u548c\u914d\u97f3\u7b56\u7565\u3002'
          }
        </p>
      </div>

      <div style={filterPanelStyle}>
        <div style={filterGroupStyle}>
          <p style={filterTitleStyle}>{'\u6837\u7247\u7b5b\u9009'}</p>
          <p style={filterSummaryStyle}>{resultSummary}</p>
          <span style={filterLabelStyle}>{'\u6309\u9898\u578b\u770b'}</span>
          <div style={filterChipRowStyle}>
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setProblemCategory(option.value)}
                style={{
                  ...filterChipStyle,
                  ...(problemCategory === option.value ? filterChipActiveStyle : {})
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div style={filterGroupStyle}>
          <span style={filterLabelStyle}>{'\u6309\u7528\u9014\u770b'}</span>
          <div style={filterChipRowStyle}>
            {useCaseOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setUseCase(option.value)}
                style={{
                  ...filterChipStyle,
                  ...(useCase === option.value ? filterChipActiveStyle : {})
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeSample ? (
        <section data-featured-stage={activeSample.slug} style={previewStageStyle}>
          <div style={previewStageCopyStyle}>
            <span style={stageEyebrowStyle}>{'\u5c01\u9762\u9884\u89c8\u6d41'}</span>
            <h3 style={stageTitleStyle}>{'\u5f53\u524d\u9884\u89c8\u6837\u7247'}</h3>
            <p style={stageDescriptionStyle}>
              {
                '\u5148\u770b\u5c01\u9762\u8868\u73b0\u548c\u6210\u7247\u5b9a\u4f4d\uff0c\u518d\u51b3\u5b9a\u662f\u5426\u8fdb\u5165\u8be6\u60c5\u9875\u6216\u4e00\u952e\u5957\u7528\u751f\u6210\u3002'
              }
            </p>
          </div>

          <div style={stagePanelStyle}>
            <FeaturedSamplePoster sample={activeSample} variant="hero" />
            <div style={stageInfoStyle}>
              <div style={stageMetaTopStyle}>
                <span style={stageSampleLabelStyle}>{'\u4e3b\u89c6\u89c9\u6837\u7247'}</span>
                <span style={stageDateStyle}>{activeSample.publishedAt}</span>
              </div>
              <h4 style={stageSampleTitleStyle}>{activeSample.title}</h4>
              <p style={stageSampleDescriptionStyle}>{activeSample.description}</p>
              <div style={stageInsightGridStyle}>
                <div style={stageInsightCardStyle}>
                  <span style={insightLabelStyle}>{'\u63a8\u8350\u6307\u6570'}</span>
                  <strong style={stageInsightValueStyle}>{`${activeSample.recommendationScore}/100`}</strong>
                </div>
                <div style={stageInsightCardStyle}>
                  <span style={insightLabelStyle}>{'\u9002\u5408\u5e74\u7ea7'}</span>
                  <strong style={stageInsightValueStyle}>{activeSample.gradeBand}</strong>
                </div>
                <div style={stageInsightCardStyle}>
                  <span style={insightLabelStyle}>{'\u8f6c\u5316\u573a\u666f'}</span>
                  <strong style={stageInsightValueStyle}>{activeSample.conversionScenario}</strong>
                </div>
              </div>
              <div style={metaRowStyle}>
                <span style={metaChipStyle}>{`${activeSample.targetDurationSec} \u79d2`}</span>
                <span style={metaChipStyle}>
                  {activeSample.style === 'exam' ? '\u5e94\u8bd5\u63d0\u5206' : '\u8001\u5e08\u8bb2\u89e3'}
                </span>
                <span style={metaChipStyle}>
                  {activeSample.voice === 'female_clear' ? '\u6e05\u6670\u5973\u58f0' : '\u6e29\u67d4\u5973\u58f0'}
                </span>
              </div>
              <div style={actionRowStyle}>
                <a href={`/samples/${activeSample.slug}`} style={secondaryActionLinkStyle}>
                  {'\u67e5\u770b\u6837\u7247\u8be6\u60c5'}
                </a>
                <a href={buildFeaturedSampleGenerationHref(activeSample)} style={actionLinkStyle}>
                  {'\u4e00\u952e\u751f\u6210\u540c\u6b3e'}
                </a>
              </div>
            </div>
          </div>

          <div data-featured-rail="sample-switcher" style={previewRailStyle}>
            <div style={previewRailHeaderStyle}>
              <div style={previewRailHeadingStyle}>
                <span style={previewRailTitleStyle}>{'\u5207\u6362\u6837\u7247'}</span>
                <span style={previewRailBodyStyle}>
                  {'\u5148\u770b\u5c01\u9762\uff0c\u518d\u5f80\u4e0b\u6d4f\u89c8\u5b8c\u6574\u6837\u7247\u5e93\u3002'}
                </span>
              </div>
              <div style={previewRailNavStyle}>
                <span data-featured-page={activeSamplePage} style={previewRailPagePillStyle}>
                  {activeSamplePage}
                </span>
                <button
                  type="button"
                  data-featured-nav="previous"
                  onClick={() => jumpToRelativeSample(-1)}
                  disabled={visibleSamples.length <= 1}
                  style={{
                    ...previewRailNavButtonStyle,
                    ...(visibleSamples.length <= 1 ? previewRailNavButtonDisabledStyle : {})
                  }}
                >
                  {'\u4e0a\u4e00\u5f20'}
                </button>
                <button
                  type="button"
                  data-featured-nav="next"
                  onClick={() => jumpToRelativeSample(1)}
                  disabled={visibleSamples.length <= 1}
                  style={{
                    ...previewRailNavButtonStyle,
                    ...(visibleSamples.length <= 1 ? previewRailNavButtonDisabledStyle : {})
                  }}
                >
                  {'\u4e0b\u4e00\u5f20'}
                </button>
              </div>
            </div>
            <div style={previewRailDotsStyle}>
              {visibleSamples.map((sample, index) => {
                const selected = sample.slug === activeSample.slug;

                return (
                  <button
                    key={sample.slug}
                    type="button"
                    data-featured-dot={selected ? 'active' : 'idle'}
                    aria-label={`\u7b2c ${index + 1} \u4e2a\u6837\u7247`}
                    onClick={() => setActiveSampleSlug(sample.slug)}
                    style={{
                      ...previewRailDotStyle,
                      ...(selected ? previewRailDotActiveStyle : {})
                    }}
                  />
                );
              })}
            </div>
            <div style={previewRailTrackStyle}>
              {visibleSamples.map((sample) => {
                const selected = sample.slug === activeSample.slug;

                return (
                  <button
                    key={sample.slug}
                    ref={(node) => {
                      thumbnailRefs.current[sample.slug] = node;
                    }}
                    type="button"
                    onClick={() => setActiveSampleSlug(sample.slug)}
                    style={{
                      ...previewRailItemStyle,
                      ...(selected ? previewRailItemActiveStyle : {})
                    }}
                  >
                    <div style={previewRailPosterStyle}>
                      <FeaturedSamplePoster sample={sample} variant="thumbnail" />
                    </div>
                    <div style={previewRailCopyStyle}>
                      {selected ? (
                        <span style={previewRailCurrentBadgeStyle}>{'\u5f53\u524d\u6837\u7247'}</span>
                      ) : null}
                      <strong style={previewRailItemTitleStyle}>{sample.title}</strong>
                      <span style={previewRailItemMetaStyle}>
                        {sample.problemCategory === 'equation'
                          ? '\u65b9\u7a0b'
                          : '\u5e94\u7528\u9898'}{' '}
                        · {sample.targetDurationSec} {'\u79d2'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {visibleSamples.length > 0 ? (
        <div style={stackStyle}>
          {groupedSamples.featured.length > 0 ? (
            <section style={sectionBandStyle}>
              <div style={sectionHeadingStyle}>
                <p style={sectionEyebrowStyle}>{'\u4e3b\u63a8\u6837\u7247'}</p>
                <p style={sectionDescriptionStyle}>
                  {'\u5f53\u524d\u4f18\u5148\u7528\u4e8e\u9996\u5c4f\u5c55\u793a\u3001\u8f6c\u5316\u6d4b\u8bd5\u548c\u5bf9\u5916\u6f14\u793a\u7684\u6837\u7247\u3002'}
                </p>
              </div>
              <div style={gridStyle}>
                {groupedSamples.featured.map((sample) => renderSampleCard(sample, setActiveSampleSlug))}
              </div>
            </section>
          ) : null}
          <section style={sectionBandStyle}>
            <div style={sectionHeadingStyle}>
              <p style={sectionEyebrowStyle}>{'\u5168\u90e8\u6837\u7247'}</p>
              <p style={sectionDescriptionStyle}>
                {'\u6309\u63a8\u8350\u6307\u6570\u6392\u5e8f\u7684\u5168\u91cf\u6837\u7247\u5e93\uff0c\u7528\u4e8e\u7ee7\u7eed\u6269\u5bb9\u9898\u578b\u548c\u5185\u5bb9\u7b56\u7565\u3002'}
              </p>
            </div>
            <div style={gridStyle}>
              {groupedSamples.library.map((sample) => renderSampleCard(sample, setActiveSampleSlug))}
            </div>
          </section>
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <p style={emptyStateTitleStyle}>{'\u6ca1\u6709\u627e\u5230\u5339\u914d\u7684\u6837\u7247'}</p>
          <p style={emptyStateBodyStyle}>
            {'\u53ef\u4ee5\u5148\u5207\u6362\u9898\u578b\u6216\u7528\u9014\u6807\u7b7e\uff0c\u7a0d\u540e\u6211\u4eec\u4e5f\u4f1a\u7ee7\u7eed\u8865\u5145\u66f4\u591a\u6837\u7247\u6a21\u677f\u3002'}
          </p>
        </div>
      )}
    </section>
  );
}

const renderSampleCard = (sample: FeaturedSample, onPreview: (slug: string) => void) => (
  <article key={sample.taskName} style={cardStyle}>
    <div style={cardHeaderStyle}>
      <p style={cardEyebrowStyle}>{'\u6807\u51c6\u6837\u7247'}</p>
      <button type="button" onClick={() => onPreview(sample.slug)} style={previewSwitchButtonStyle}>
        {'\u8bbe\u4e3a\u5f53\u524d\u9884\u89c8'}
      </button>
    </div>
    <h3 style={cardTitleStyle}>{sample.title}</h3>
    <FeaturedSamplePoster sample={sample} variant="card" />
    <p style={cardDescriptionStyle}>{sample.description}</p>
    <div style={insightGridStyle}>
      <div style={insightItemStyle}>
        <span style={insightLabelStyle}>{'\u63a8\u8350\u6307\u6570'}</span>
        <strong style={insightValueStyle}>{`${sample.recommendationScore}/100`}</strong>
      </div>
      <div style={insightItemStyle}>
        <span style={insightLabelStyle}>{'\u9002\u5408\u5e74\u7ea7'}</span>
        <strong style={insightValueStyle}>{sample.gradeBand}</strong>
      </div>
      <div style={insightItemStyle}>
        <span style={insightLabelStyle}>{'\u8f6c\u5316\u573a\u666f'}</span>
        <strong style={insightValueStyle}>{sample.conversionScenario}</strong>
      </div>
    </div>
    <p style={summaryLineStyle}>
      {`\u9002\u5408 ${sample.gradeBand}\uff0c\u9ed8\u8ba4 ${sample.targetDurationSec} \u79d2\uff0c${
        sample.style === 'exam' ? '\u504f\u63d0\u5206\u8bb2\u89e3' : '\u504f\u6807\u51c6\u8bb2\u89e3'
      }\u3002`}
    </p>
    <div style={metaRowStyle}>
      <span style={metaChipStyle}>{`${sample.targetDurationSec} \u79d2`}</span>
      <span style={metaChipStyle}>{sample.style === 'exam' ? '\u5e94\u8bd5\u63d0\u5206' : '\u8001\u5e08\u8bb2\u89e3'}</span>
      <span style={metaChipStyle}>{sample.voice === 'female_clear' ? '\u6e05\u6670\u5973\u58f0' : '\u6e29\u67d4\u5973\u58f0'}</span>
      <span style={metaChipStyle}>{sample.publishedAt}</span>
    </div>
    <div style={actionRowStyle}>
      <a href={`/samples/${sample.slug}`} style={secondaryActionLinkStyle}>
        {'\u67e5\u770b\u6837\u7247\u8be6\u60c5'}
      </a>
      <a href={buildFeaturedSampleGenerationHref(sample)} style={actionLinkStyle}>
        {'\u4e00\u952e\u751f\u6210\u540c\u6b3e'}
      </a>
    </div>
  </article>
);

const sectionStyle = {
  background: 'linear-gradient(135deg, #102A43 0%, #1B4332 100%)',
  borderRadius: 28,
  color: '#FFF7D6',
  margin: '24px 0',
  padding: 28
};

const headerStyle = {
  display: 'grid',
  gap: 8,
  marginBottom: 20
};

const eyebrowStyle = {
  color: '#F5C542',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 1.8,
  margin: 0
};

const titleStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 34,
  lineHeight: 1.1,
  margin: 0
};

const descriptionStyle = {
  color: 'rgba(255,247,214,0.88)',
  lineHeight: 1.7,
  margin: 0,
  maxWidth: 820
};

const filterPanelStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 18,
  display: 'grid',
  gap: 14,
  marginBottom: 18,
  padding: 18
};

const filterGroupStyle = {
  display: 'grid',
  gap: 8
};

const filterTitleStyle = {
  color: '#FFF7D6',
  fontSize: 15,
  fontWeight: 800,
  margin: 0
};

const filterSummaryStyle = {
  color: 'rgba(255,247,214,0.92)',
  fontSize: 14,
  fontWeight: 700,
  margin: 0
};

const filterLabelStyle = {
  color: 'rgba(255,247,214,0.84)',
  fontSize: 13,
  fontWeight: 700
};

const filterChipRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8
};

const filterChipStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 999,
  color: '#FFF7D6',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: 13,
  fontWeight: 700,
  padding: '8px 12px'
};

const filterChipActiveStyle = {
  background: '#FFF4CC',
  borderColor: '#FFF4CC',
  color: '#7C4A03'
};

const previewStageStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 24,
  display: 'grid',
  gap: 18,
  marginBottom: 22,
  padding: 18
};

const previewStageCopyStyle = {
  display: 'grid',
  gap: 8
};

const stageEyebrowStyle = {
  color: '#F5C542',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.4
};

const stageTitleStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 32,
  lineHeight: 1.12,
  margin: 0
};

const stageDescriptionStyle = {
  color: 'rgba(255,247,214,0.86)',
  lineHeight: 1.7,
  margin: 0,
  maxWidth: 720
};

const stagePanelStyle = {
  alignItems: 'stretch',
  display: 'grid',
  gap: 18,
  gridTemplateColumns: 'minmax(240px, 360px) minmax(0, 1fr)'
};

const stageInfoStyle = {
  background: 'rgba(255,250,241,0.96)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 24,
  color: '#102A43',
  display: 'grid',
  gap: 14,
  padding: 20
};

const stageMetaTopStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: 12,
  justifyContent: 'space-between'
};

const stageSampleLabelStyle = {
  background: '#FFF4CC',
  borderRadius: 999,
  color: '#7C4A03',
  display: 'inline-flex',
  fontSize: 12,
  fontWeight: 800,
  padding: '6px 10px'
};

const stageDateStyle = {
  color: '#6B7280',
  fontSize: 13,
  fontWeight: 700
};

const stageSampleTitleStyle = {
  fontSize: 30,
  lineHeight: 1.15,
  margin: 0
};

const stageSampleDescriptionStyle = {
  color: '#374151',
  lineHeight: 1.7,
  margin: 0
};

const stageInsightGridStyle = {
  display: 'grid',
  gap: 10,
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'
};

const stageInsightCardStyle = {
  background: '#FFF7E0',
  borderRadius: 16,
  display: 'grid',
  gap: 4,
  padding: '12px 14px'
};

const stageInsightValueStyle = {
  color: '#102A43',
  fontSize: 16,
  lineHeight: 1.4
};

const previewRailStyle = {
  display: 'grid',
  gap: 12
};

const previewRailHeaderStyle = {
  alignItems: 'end',
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 10,
  justifyContent: 'space-between'
};

const previewRailHeadingStyle = {
  display: 'grid',
  gap: 4
};

const previewRailTitleStyle = {
  color: '#FFF7D6',
  fontSize: 15,
  fontWeight: 800
};

const previewRailBodyStyle = {
  color: 'rgba(255,247,214,0.82)',
  fontSize: 13,
  lineHeight: 1.5
};

const previewRailNavStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 12,
  justifyContent: 'flex-end'
};

const previewRailPagePillStyle = {
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 999,
  color: '#FFF7D6',
  display: 'inline-flex',
  fontSize: 12,
  fontWeight: 800,
  padding: '7px 11px'
};

const previewRailNavButtonStyle = {
  ...createButtonStyle({tone: 'quiet'}),
  background: 'rgba(255,255,255,0.14)',
  border: '1px solid rgba(255,255,255,0.18)',
  color: '#FFF7D6',
  padding: '8px 12px'
};

const previewRailNavButtonDisabledStyle = {
  cursor: 'not-allowed',
  opacity: 0.5
};

const previewRailTrackStyle = {
  display: 'flex',
  gap: 12,
  overflowX: 'auto' as const,
  paddingBottom: 4,
  scrollSnapType: 'x proximity' as const
};

const previewRailDotsStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: 8,
  justifyContent: 'center'
};

const previewRailDotStyle = {
  background: 'rgba(255,255,255,0.28)',
  border: 'none',
  borderRadius: 999,
  cursor: 'pointer',
  display: 'inline-flex',
  height: 8,
  padding: 0,
  transition: 'all 160ms ease',
  width: 8
};

const previewRailDotActiveStyle = {
  background: '#FFF4CC',
  boxShadow: '0 0 0 4px rgba(255,244,204,0.18)',
  width: 20
};

const previewRailItemStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 18,
  color: '#FFF7D6',
  cursor: 'pointer',
  display: 'grid',
  flex: '0 0 220px',
  gap: 10,
  padding: 12,
  scrollSnapAlign: 'start' as const,
  textAlign: 'left' as const
};

const previewRailItemActiveStyle = {
  background: 'rgba(255,244,204,0.16)',
  borderColor: '#FFF4CC',
  boxShadow: '0 8px 20px rgba(16, 42, 67, 0.18)'
};

const previewRailPosterStyle = {
  display: 'grid'
};

const previewRailCopyStyle = {
  display: 'grid',
  gap: 4
};

const previewRailCurrentBadgeStyle = {
  background: 'rgba(255,244,204,0.16)',
  border: '1px solid rgba(255,244,204,0.4)',
  borderRadius: 999,
  color: '#FFF4CC',
  display: 'inline-flex',
  fontSize: 11,
  fontWeight: 800,
  padding: '5px 8px',
  width: 'fit-content'
};

const previewRailItemTitleStyle = {
  fontSize: 15,
  lineHeight: 1.45
};

const previewRailItemMetaStyle = {
  color: 'rgba(255,247,214,0.78)',
  fontSize: 12,
  lineHeight: 1.5
};

const gridStyle = {
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
};

const stackStyle = {
  display: 'grid',
  gap: 20
};

const sectionBandStyle = {
  display: 'grid',
  gap: 14
};

const sectionHeadingStyle = {
  display: 'grid',
  gap: 6
};

const sectionEyebrowStyle = {
  color: '#FFF7D6',
  fontSize: 14,
  fontWeight: 800,
  margin: 0
};

const sectionDescriptionStyle = {
  color: 'rgba(255,247,214,0.82)',
  lineHeight: 1.6,
  margin: 0
};

const cardStyle = {
  ...createCardStyle(),
  background: 'rgba(255, 250, 241, 0.94)',
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: 22,
  color: '#102A43',
  gap: 12,
  padding: 20
};

const cardHeaderStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: 10,
  justifyContent: 'space-between'
};

const previewSwitchButtonStyle = {
  ...createButtonStyle({tone: 'quiet'}),
  fontSize: 12,
  padding: '8px 12px'
};

const cardEyebrowStyle = {
  color: '#1F5134',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.4,
  margin: 0
};

const cardTitleStyle = {
  fontSize: 24,
  lineHeight: 1.2,
  margin: 0
};

const cardDescriptionStyle = {
  color: '#374151',
  lineHeight: 1.6,
  margin: 0
};

const insightGridStyle = {
  display: 'grid',
  gap: 10,
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'
};

const insightItemStyle = {
  background: '#FFF7E0',
  borderRadius: 14,
  display: 'grid',
  gap: 4,
  padding: '10px 12px'
};

const insightLabelStyle = {
  color: '#7C4A03',
  fontSize: 12,
  fontWeight: 700
};

const insightValueStyle = {
  color: '#102A43',
  fontSize: 15,
  lineHeight: 1.4
};

const metaRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8
};

const summaryLineStyle = {
  color: '#4b5563',
  lineHeight: 1.6,
  margin: 0
};

const metaChipStyle = {
  ...createPillStyle({tone: 'success'}),
  fontSize: 13
};

const actionLinkStyle = {
  ...createButtonStyle({tone: 'primary'}),
  background: '#102A43',
  color: '#FFF7D6'
};

const actionRowStyle = {
  display: 'grid',
  gap: 8,
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))'
};

const secondaryActionLinkStyle = {
  ...createButtonStyle({tone: 'secondary'}),
  color: '#102A43'
};

const emptyStateStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px dashed rgba(255,255,255,0.2)',
  borderRadius: 18,
  display: 'grid',
  gap: 8,
  padding: 24
};

const emptyStateTitleStyle = {
  color: '#FFF7D6',
  fontSize: 18,
  fontWeight: 800,
  margin: 0
};

const emptyStateBodyStyle = {
  color: 'rgba(255,247,214,0.84)',
  lineHeight: 1.7,
  margin: 0,
  maxWidth: 640
};
