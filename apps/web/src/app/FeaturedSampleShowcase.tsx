'use client';

import React, {useState} from 'react';

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

  const visibleSamples = sortFeaturedSamplesByRecommendation(
    filterFeaturedSamples(featuredSamples, {problemCategory, useCase})
  );
  const groupedSamples = splitFeaturedSamples(visibleSamples);
  const resultSummary =
    visibleSamples.length > 0
      ? `\u5f53\u524d\u5171 ${visibleSamples.length} \u4e2a\u6837\u7247`
      : '\u6ca1\u6709\u627e\u5230\u5339\u914d\u7684\u6837\u7247';

  return (
    <section id="featured-samples" style={sectionStyle}>
      <div style={headerStyle}>
        <p style={eyebrowStyle}>{'\u7cbe\u9009\u6837\u7247'}</p>
        <h2 style={titleStyle}>{'\u7cbe\u9009\u6837\u7247\u5e93'}</h2>
        <p style={descriptionStyle}>
          {'\u4e3a\u6f14\u793a\u3001\u6c47\u62a5\u548c\u62db\u751f\u573a\u666f\u51c6\u5907\u7684\u6807\u51c6 demo\uff0c\u4e00\u952e\u5e26\u5165\u9898\u76ee\u3001\u4efb\u52a1\u540d\u79f0\u3001\u65f6\u957f\u548c\u914d\u97f3\u7b56\u7565\u3002'}
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
              <div style={gridStyle}>{groupedSamples.featured.map(renderSampleCard)}</div>
            </section>
          ) : null}
          <section style={sectionBandStyle}>
            <div style={sectionHeadingStyle}>
              <p style={sectionEyebrowStyle}>{'\u5168\u90e8\u6837\u7247'}</p>
              <p style={sectionDescriptionStyle}>
                {'\u6309\u63a8\u8350\u6307\u6570\u6392\u5e8f\u7684\u5168\u91cf\u6837\u7247\u5e93\uff0c\u7528\u4e8e\u7ee7\u7eed\u6269\u5bb9\u9898\u578b\u548c\u5185\u5bb9\u7b56\u7565\u3002'}
              </p>
            </div>
            <div style={gridStyle}>{groupedSamples.library.map(renderSampleCard)}</div>
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

const renderSampleCard = (sample: FeaturedSample) => (
  <article key={sample.taskName} style={cardStyle}>
    <p style={cardEyebrowStyle}>{'\u6807\u51c6\u6837\u7247'}</p>
    <h3 style={cardTitleStyle}>{sample.title}</h3>
    <div style={posterPreviewStyle}>
      <div style={posterTopRowStyle}>
        <span style={posterKickerStyle}>{sample.posterKicker}</span>
        <span style={posterBrandStyle}>{'Love Learning'}</span>
      </div>
      <div style={posterFormulaStyle}>{sample.content}</div>
      <p style={posterCaptionStyle}>{sample.posterCaption}</p>
      <div style={posterFooterStyle}>
        <span style={posterBadgeStyle}>{'\u5c01\u9762\u9884\u89c8'}</span>
        <span style={posterFootnoteStyle}>{'\u6210\u7247\u9884\u671f\uff1a9:16 \u7ad6\u5c4f\u77ed\u89c6\u9891'}</span>
      </div>
    </div>
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
      {`适合 ${sample.gradeBand}，默认 ${sample.targetDurationSec} 秒，${sample.style === 'exam' ? '偏提分讲解' : '偏标准讲解'}。`}
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
  background: 'rgba(255, 250, 241, 0.94)',
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: 22,
  color: '#102A43',
  display: 'grid',
  gap: 12,
  padding: 20
};

const posterPreviewStyle = {
  aspectRatio: '9 / 16',
  background: 'linear-gradient(180deg, #14324A 0%, #245B45 100%)',
  borderRadius: 22,
  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
  color: '#FFF7D6',
  display: 'grid',
  gap: 14,
  padding: 18
};

const posterTopRowStyle = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between'
};

const posterKickerStyle = {
  background: 'rgba(245,197,66,0.18)',
  borderRadius: 999,
  color: '#F5C542',
  fontSize: 12,
  fontWeight: 800,
  padding: '6px 10px'
};

const posterBrandStyle = {
  color: 'rgba(255,247,214,0.8)',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1
};

const posterFormulaStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: 18,
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 24,
  lineHeight: 1.35,
  minHeight: 96,
  padding: 16
};

const posterCaptionStyle = {
  fontSize: 22,
  fontWeight: 800,
  lineHeight: 1.35,
  margin: 0
};

const posterFooterStyle = {
  alignSelf: 'end',
  display: 'grid',
  gap: 8
};

const posterBadgeStyle = {
  background: '#FFF4CC',
  borderRadius: 999,
  color: '#7C4A03',
  display: 'inline-flex',
  fontSize: 12,
  fontWeight: 800,
  padding: '6px 10px',
  width: 'fit-content'
};

const posterFootnoteStyle = {
  color: 'rgba(255,247,214,0.84)',
  fontSize: 12,
  lineHeight: 1.5
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
  background: '#E7F0DA',
  borderRadius: 999,
  color: '#1F5134',
  fontSize: 13,
  fontWeight: 700,
  padding: '6px 10px'
};

const actionLinkStyle = {
  background: '#102A43',
  borderRadius: 999,
  color: '#FFF7D6',
  display: 'inline-flex',
  justifyContent: 'center',
  padding: '10px 16px',
  textDecoration: 'none'
};

const actionRowStyle = {
  display: 'grid',
  gap: 8,
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))'
};

const secondaryActionLinkStyle = {
  background: '#FFFFFF',
  border: '1px solid #d7c8a9',
  borderRadius: 999,
  color: '#102A43',
  display: 'inline-flex',
  justifyContent: 'center',
  padding: '10px 16px',
  textDecoration: 'none'
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
