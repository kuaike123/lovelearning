import {notFound} from 'next/navigation';
import React from 'react';

import {
  buildFeaturedSampleGenerationHref,
  featuredSamples,
  getFeaturedSampleBySlug
} from '../../featured-samples';
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

  return (
    <main style={pageStyle}>
      <a href="/" style={backLinkStyle}>
        {'\u8fd4\u56de\u9996\u9875'}
      </a>
      <section style={heroStyle}>
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
            <h2 style={sectionTitleStyle}>{'\u6837\u7247\u9898\u76ee'}</h2>
            <p style={problemTextStyle}>{sample.content}</p>
          </section>
          <SampleWorkbenchActions generationHref={generationHref} problemText={sample.content} />
        </div>
      </section>
    </main>
  );
}

const pageStyle = {
  background: '#fbf7ef',
  color: '#102A43',
  margin: '0 auto',
  maxWidth: 1120,
  padding: 32
};

const backLinkStyle = {
  color: '#1F5134',
  display: 'inline-flex',
  fontWeight: 700,
  marginBottom: 20,
  textDecoration: 'none'
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

const eyebrowStyle = {
  color: '#6f7d45',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 1.4,
  margin: 0
};

const titleStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 44,
  lineHeight: 1.1,
  margin: 0
};

const descriptionStyle = {
  color: '#374151',
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
  background: '#fff7e0',
  borderRadius: 16,
  display: 'grid',
  gap: 6,
  padding: '12px 14px'
};

const overviewLabelStyle = {
  color: '#7c4a03',
  fontSize: 12,
  fontWeight: 700
};

const overviewValueStyle = {
  color: '#102A43',
  fontSize: 16,
  lineHeight: 1.4
};

const metaRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8
};

const metaChipStyle = {
  background: '#E7F0DA',
  borderRadius: 999,
  color: '#1F5134',
  fontSize: 13,
  fontWeight: 700,
  padding: '6px 10px'
};

const detailGridStyle = {
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
};

const detailSectionStyle = {
  background: '#fffaf1',
  border: '1px solid #eadfca',
  borderRadius: 18,
  padding: 18
};

const sectionTitleStyle = {
  fontSize: 17,
  margin: '0 0 10px'
};

const listStyle = {
  color: '#374151',
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
  background: '#FFF4CC',
  borderRadius: 999,
  color: '#7C4A03',
  fontSize: 12,
  fontWeight: 700,
  padding: '6px 10px'
};

const problemSectionStyle = {
  background: '#ffffff',
  border: '1px solid #eadfca',
  borderRadius: 18,
  padding: 18
};

const problemTextStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 22,
  lineHeight: 1.5,
  margin: 0
};
