import React from 'react';

import type {FeaturedSample} from './featured-samples';

type FeaturedSamplePosterProps = {
  sample: FeaturedSample;
  variant: 'hero' | 'card' | 'thumbnail' | 'detail';
};

export function FeaturedSamplePoster({sample, variant}: FeaturedSamplePosterProps) {
  const compact = variant === 'thumbnail';
  const prominent = variant === 'hero' || variant === 'detail';
  const posterCategoryLabel =
    sample.problemCategory === 'equation' ? '\u65b9\u7a0b\u8bb2\u89e3' : '\u5e94\u7528\u9898\u63d0\u5206';
  const posterTeacherHook =
    sample.style === 'exam'
      ? '\u8bb2\u5e08\u53e3\u64ad\u5356\u70b9\uff1a3 \u6b65\u62c6\u51fa\u5f97\u5206\u70b9'
      : '\u8bb2\u5e08\u53e3\u64ad\u5356\u70b9\uff1a45 \u79d2\u8bb2\u6e05\u6838\u5fc3\u601d\u8def';
  const posterCta =
    variant === 'thumbnail' ? '\u70b9\u51fb\u9884\u89c8' : '\u7acb\u5373\u751f\u6210\u540c\u6b3e';
  const ctaVariant = variant === 'detail' ? 'detail' : variant;

  return (
    <div
      style={{
        ...posterPreviewStyle,
        ...(prominent ? prominentPosterPreviewStyle : {}),
        ...(compact ? thumbnailPosterPreviewStyle : {})
      }}
    >
      <div style={posterTopRowStyle}>
        <span style={posterKickerStyle}>{sample.posterKicker}</span>
        <span style={posterBrandStyle}>{'Love Learning'}</span>
      </div>
      <div style={posterCategoryRowStyle}>
        <span style={posterCategoryBadgeStyle}>{posterCategoryLabel}</span>
        <span style={posterTeacherBadgeStyle}>{sample.gradeBand}</span>
      </div>
      <div
        style={{
          ...posterFormulaStyle,
          ...(prominent ? prominentPosterFormulaStyle : {}),
          ...(compact ? thumbnailPosterFormulaStyle : {})
        }}
      >
        {sample.content}
      </div>
      <p
        style={{
          ...posterCaptionStyle,
          ...(prominent ? prominentPosterCaptionStyle : {}),
          ...(compact ? thumbnailPosterCaptionStyle : {})
        }}
      >
        {sample.posterCaption}
      </p>
      {!compact ? <div style={posterTeacherHookStyle}>{posterTeacherHook}</div> : null}
      <div style={posterFooterStyle}>
        <span style={posterBadgeStyle}>{'\u5c01\u9762\u9884\u89c8'}</span>
        <span style={posterFootnoteStyle}>{'\u6210\u7247\u9884\u671f\uff1a9:16 \u7ad6\u5c4f\u77ed\u89c6\u9891'}</span>
        <div data-poster-cta={ctaVariant} style={posterCtaStyle}>
          <span style={posterCtaTextStyle}>{posterCta}</span>
          <span style={posterCtaArrowStyle}>{'\u2192'}</span>
        </div>
      </div>
    </div>
  );
}

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

const prominentPosterPreviewStyle = {
  minHeight: '100%'
};

const thumbnailPosterPreviewStyle = {
  aspectRatio: '9 / 13',
  borderRadius: 16,
  gap: 8,
  padding: 10
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

const posterCategoryRowStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8
};

const posterCategoryBadgeStyle = {
  background: '#FFF4CC',
  borderRadius: 999,
  color: '#7C4A03',
  display: 'inline-flex',
  fontSize: 12,
  fontWeight: 800,
  padding: '6px 10px'
};

const posterTeacherBadgeStyle = {
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 999,
  color: '#FFF7D6',
  display: 'inline-flex',
  fontSize: 12,
  fontWeight: 700,
  padding: '6px 10px'
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

const prominentPosterFormulaStyle = {
  fontSize: 30,
  minHeight: 132
};

const thumbnailPosterFormulaStyle = {
  borderRadius: 12,
  fontSize: 15,
  minHeight: 52,
  padding: 10
};

const posterCaptionStyle = {
  fontSize: 22,
  fontWeight: 800,
  lineHeight: 1.35,
  margin: 0
};

const prominentPosterCaptionStyle = {
  fontSize: 28
};

const thumbnailPosterCaptionStyle = {
  fontSize: 14
};

const posterTeacherHookStyle = {
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 16,
  color: '#FFF7D6',
  fontSize: 13,
  fontWeight: 700,
  lineHeight: 1.6,
  padding: '10px 12px'
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

const posterCtaStyle = {
  alignItems: 'center',
  background: '#FFF4CC',
  borderRadius: 999,
  color: '#7C4A03',
  display: 'inline-flex',
  gap: 8,
  justifyContent: 'space-between',
  padding: '8px 12px',
  width: 'fit-content'
};

const posterCtaTextStyle = {
  fontSize: 12,
  fontWeight: 800
};

const posterCtaArrowStyle = {
  fontSize: 13,
  fontWeight: 800
};
