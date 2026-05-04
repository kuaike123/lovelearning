import {notFound} from 'next/navigation';
import React from 'react';

import {
  buildFeaturedSampleGenerationHref,
  featuredSamples,
  getFeaturedSampleBySlug,
  getFeaturedSampleNeighbors,
  getFeaturedSamplePosition,
  getRelatedFeaturedSamples
} from '../../featured-samples';
import {FeaturedSamplePoster} from '../../FeaturedSamplePoster';
import {
  createSketchButtonStyle,
  createSketchCardStyle,
  createSketchEyebrowStyle,
  createSketchPageStyle,
  createSketchPillStyle,
  sketchColors
} from '../../../styles/ui-helpers';
import {SampleWorkbenchActions} from './SampleWorkbenchActions';

type SampleDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateStaticParams = () => {
  return featuredSamples.map((sample) => ({slug: sample.slug}));
};

export default async function SampleDetailPage({params}: SampleDetailPageProps) {
  const {slug} = await params;
  const sample = getFeaturedSampleBySlug(slug);

  if (!sample) {
    notFound();
  }

  const generationHref = buildFeaturedSampleGenerationHref(sample);
  const neighbors = getFeaturedSampleNeighbors(sample.slug);
  const position = getFeaturedSamplePosition(sample.slug);
  const relatedSamples = getRelatedFeaturedSamples(sample.slug, 2);

  return (
    <main data-sketch-sample-detail="director-board" style={pageStyle}>
      <a href="/" style={backLinkStyle}>
        {'\u8fd4\u56de\u9996\u9875'}
      </a>

      <section style={topNavStyle}>
        <div style={topNavHeaderStyle}>
          <a href={`/#featured-samples`} style={libraryBackLinkStyle}>
            {'\u8fd4\u56de\u6837\u7247\u5e93'}
          </a>
          <div style={pageIndicatorWrapStyle}>
            <span style={pageIndicatorLabelStyle}>{'\u5f53\u524d\u6d4f\u89c8'}</span>
            <span data-sample-page={position.pageLabel} style={pageIndicatorPillStyle}>
              {position.pageLabel}
            </span>
          </div>
        </div>
        <div style={sampleNavGridStyle}>
          {neighbors.previous ? (
            <a href={`/samples/${neighbors.previous.slug}`} style={sampleNavCardStyle}>
              <span style={sampleNavEyebrowStyle}>{'\u4e0a\u4e00\u6761\u6837\u7247'}</span>
              <strong style={sampleNavTitleStyle}>{neighbors.previous.title}</strong>
            </a>
          ) : null}
          {neighbors.next ? (
            <a href={`/samples/${neighbors.next.slug}`} style={sampleNavCardStyle}>
              <span style={sampleNavEyebrowStyle}>{'\u4e0b\u4e00\u6761\u6837\u7247'}</span>
              <strong style={sampleNavTitleStyle}>{neighbors.next.title}</strong>
            </a>
          ) : null}
        </div>
      </section>

      <section style={heroStyle}>
        <FeaturedSamplePoster sample={sample} variant="detail" />
        <div style={contentStyle}>
          <p style={eyebrowStyle}>{'\u6837\u7247\u8be6\u60c5'}</p>
          <h1 style={titleStyle}>{sample.title}</h1>
          <p style={descriptionStyle}>{sample.description}</p>
          <div style={overviewGridStyle}>
            <div style={overviewItemStyle}>
              <span style={overviewLabelStyle}>{'\u63a8\u8350\u6307\u6570'}</span>
              <strong style={overviewValueStyle}>{`${sample.recommendationScore}/100`}</strong>
            </div>
            <div style={overviewItemStyle}>
              <span style={overviewLabelStyle}>{'\u9002\u5408\u5e74\u7ea7'}</span>
              <strong style={overviewValueStyle}>{sample.gradeBand}</strong>
            </div>
            <div style={overviewItemStyle}>
              <span style={overviewLabelStyle}>{'\u8f6c\u5316\u573a\u666f'}</span>
              <strong style={overviewValueStyle}>{sample.conversionScenario}</strong>
            </div>
            <div style={overviewItemStyle}>
              <span style={overviewLabelStyle}>{'\u53d1\u5e03\u65f6\u95f4'}</span>
              <strong style={overviewValueStyle}>{sample.publishedAt}</strong>
            </div>
          </div>
          <div style={metaRowStyle}>
            <span style={metaChipStyle}>{`${sample.targetDurationSec} \u79d2`}</span>
            <span style={metaChipStyle}>{sample.style === 'exam' ? '\u5e94\u8bd5\u63d0\u5206' : '\u8001\u5e08\u8bb2\u89e3'}</span>
            <span style={metaChipStyle}>{sample.voice === 'female_clear' ? '\u6e05\u6670\u5973\u58f0' : '\u6e29\u67d4\u5973\u58f0'}</span>
          </div>
          <div style={detailGridStyle}>
            <section style={detailSectionStyle}>
              <p style={sectionEyebrowStyle}>{'SCRIPT NOTES / \u8bb2\u89e3\u5356\u70b9'}</p>
              <h2 style={sectionTitleStyle}>{'\u8bb2\u89e3\u4eae\u70b9'}</h2>
              <ul style={listStyle}>
                {sample.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </section>
            <section style={detailSectionStyle}>
              <h2 style={sectionTitleStyle}>{'\u9002\u7528\u573a\u666f'}</h2>
              <div style={useCaseListStyle}>
                {sample.useCases.map((useCase) => (
                  <span key={useCase} style={useCaseChipStyle}>
                    {useCase}
                  </span>
                ))}
              </div>
            </section>
          </div>
          <section style={problemSectionStyle}>
            <p style={sectionEyebrowStyle}>{'SHOT BOARD / \u6837\u7247\u5206\u955c'}</p>
            <h2 style={sectionTitleStyle}>{'\u6837\u7247\u9898\u76ee'}</h2>
            <p style={problemTextStyle}>{sample.content}</p>
          </section>
          <SampleWorkbenchActions generationHref={generationHref} problemText={sample.content} />
        </div>
      </section>

      {relatedSamples.length > 0 ? (
        <section style={relatedSectionStyle}>
          <div style={relatedHeaderStyle}>
            <p style={relatedEyebrowStyle}>{'\u76f8\u5173\u63a8\u8350'}</p>
            <h2 style={relatedTitleStyle}>{'\u7ee7\u7eed\u6d4f\u89c8'}</h2>
          </div>
          <div style={relatedGridStyle}>
            {relatedSamples.map((relatedSample) => (
              <a key={relatedSample.slug} href={`/samples/${relatedSample.slug}`} style={relatedCardStyle}>
                <div data-related-poster={relatedSample.slug} style={relatedPosterStyle}>
                  <FeaturedSamplePoster sample={relatedSample} variant="thumbnail" />
                </div>
                <span style={relatedCardEyebrowStyle}>{relatedSample.posterKicker}</span>
                <strong style={relatedCardTitleStyle}>{relatedSample.title}</strong>
                <p style={relatedCardBodyStyle}>{relatedSample.description}</p>
                <div style={relatedMetaRowStyle}>
                  <span style={relatedMetaChipStyle}>{relatedSample.gradeBand}</span>
                  <span style={relatedMetaChipStyle}>{`${relatedSample.targetDurationSec} \u79d2`}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

const pageStyle = {
  ...createSketchPageStyle(),
  margin: '0 auto',
  maxWidth: 1120,
  padding: 32
};

const backLinkStyle = {
  ...createSketchButtonStyle({tone: 'secondary'}),
  marginBottom: 20
};

const topNavStyle = {
  display: 'grid',
  gap: 14,
  marginBottom: 24
};

const topNavHeaderStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 12,
  justifyContent: 'space-between'
};

const libraryBackLinkStyle = {
  ...createSketchButtonStyle({tone: 'quiet'})
};

const pageIndicatorWrapStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: 10
};

const pageIndicatorLabelStyle = {
  color: sketchColors.muted,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.2
};

const pageIndicatorPillStyle = {
  ...createSketchPillStyle({tone: 'dark'}),
  fontSize: 12,
  padding: '8px 12px'
};

const sampleNavGridStyle = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'
};

const sampleNavCardStyle = {
  ...createSketchCardStyle({tone: 'paper'}),
  gap: 6,
  padding: 16,
  textDecoration: 'none'
};

const sampleNavEyebrowStyle = {
  color: sketchColors.accent,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.2
};

const sampleNavTitleStyle = {
  fontSize: 17,
  lineHeight: 1.45
};

const heroStyle = {
  alignItems: 'start',
  display: 'grid',
  gap: 28,
  gridTemplateColumns: 'minmax(260px, 360px) minmax(0, 1fr)'
};

const posterPreviewStyle = {
  aspectRatio: '9 / 16',
  background: 'linear-gradient(180deg, #14324A 0%, #245B45 100%)',
  borderRadius: 24,
  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
  color: '#FFF7D6',
  display: 'grid',
  gap: 16,
  padding: 22
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
  fontSize: 26,
  lineHeight: 1.35,
  minHeight: 112,
  padding: 18
};

const posterCaptionStyle = {
  fontSize: 25,
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

const contentStyle = {
  display: 'grid',
  gap: 18
};

const eyebrowStyle = createSketchEyebrowStyle();

const titleStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 44,
  lineHeight: 1.1,
  margin: 0
};

const descriptionStyle = {
  color: sketchColors.muted,
  fontSize: 18,
  lineHeight: 1.7,
  margin: 0
};

const overviewGridStyle = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))'
};

const overviewItemStyle = {
  ...createSketchCardStyle(),
  borderWidth: 2,
  gap: 6,
  padding: '12px 14px'
};

const overviewLabelStyle = {
  color: sketchColors.accent,
  fontSize: 12,
  fontWeight: 700
};

const overviewValueStyle = {
  color: sketchColors.ink,
  fontSize: 16,
  lineHeight: 1.4
};

const metaRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8
};

const metaChipStyle = {
  ...createSketchPillStyle({tone: 'success'}),
  fontSize: 13,
  fontWeight: 700
};

const detailGridStyle = {
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
};

const detailSectionStyle = {
  ...createSketchCardStyle({tone: 'paper'}),
  padding: 18
};

const sectionEyebrowStyle = {
  color: sketchColors.accent,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.2,
  margin: '0 0 8px'
};

const sectionTitleStyle = {
  fontSize: 17,
  margin: '0 0 10px'
};

const listStyle = {
  color: sketchColors.muted,
  lineHeight: 1.7,
  margin: 0,
  paddingLeft: 18
};

const useCaseListStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8
};

const useCaseChipStyle = {
  ...createSketchPillStyle({tone: 'accent'}),
  fontSize: 12,
  fontWeight: 700
};

const problemSectionStyle = {
  ...createSketchCardStyle(),
  border: `3px dashed ${sketchColors.ink}`,
  padding: 18
};

const problemTextStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 22,
  lineHeight: 1.5,
  margin: 0
};

const relatedSectionStyle = {
  display: 'grid',
  gap: 14,
  marginTop: 28
};

const relatedHeaderStyle = {
  display: 'grid',
  gap: 6
};

const relatedEyebrowStyle = {
  color: sketchColors.accent,
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 1.2,
  margin: 0
};

const relatedTitleStyle = {
  fontSize: 28,
  lineHeight: 1.15,
  margin: 0
};

const relatedGridStyle = {
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'
};

const relatedCardStyle = {
  ...createSketchCardStyle({tone: 'paper'}),
  gap: 8,
  padding: 18,
  textDecoration: 'none'
};

const relatedPosterStyle = {
  display: 'grid'
};

const relatedCardEyebrowStyle = {
  color: sketchColors.accent,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.2
};

const relatedCardTitleStyle = {
  fontSize: 20,
  lineHeight: 1.35
};

const relatedCardBodyStyle = {
  color: sketchColors.muted,
  lineHeight: 1.65,
  margin: 0
};

const relatedMetaRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8
};

const relatedMetaChipStyle = {
  ...createSketchPillStyle({tone: 'success'}),
  fontSize: 12,
  fontWeight: 700
};
