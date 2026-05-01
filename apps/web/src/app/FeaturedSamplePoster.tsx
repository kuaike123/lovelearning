import React from 'react';

import type {FeaturedSample} from './featured-samples';
import {createSketchGridBackground, createSketchPillStyle, sketchColors} from './ui-primitives';

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
      data-sketch-poster={variant}
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
  background: createSketchGridBackground(sketchColors.paper, '0.08'),
  backgroundSize: '18px 18px',
  border: `3px solid ${sketchColors.ink}`,
  borderRadius: 18,
  boxShadow: `8px 8px 0 ${sketchColors.ink}`,
  color: sketchColors.ink,
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
  ...createSketchPillStyle({tone: 'default'}),
  background: sketchColors.warm,
  fontSize: 12,
  padding: '6px 10px'
};

const posterBrandStyle = {
  color: sketchColors.muted,
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
  ...createSketchPillStyle({tone: 'success'}),
  fontSize: 12,
  padding: '6px 10px'
};

const posterTeacherBadgeStyle = {
  background: sketchColors.surface,
  border: `2px dashed ${sketchColors.muted}`,
  borderRadius: 999,
  color: sketchColors.ink,
  display: 'inline-flex',
  fontSize: 12,
  fontWeight: 700,
  padding: '6px 10px'
};

const posterFormulaStyle = {
  background: sketchColors.surface,
  border: `3px solid ${sketchColors.ink}`,
  borderRadius: 16,
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
  background: sketchColors.danger,
  border: `2px solid ${sketchColors.ink}`,
  borderRadius: 14,
  color: sketchColors.ink,
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
  ...createSketchPillStyle({tone: 'accent'}),
  fontSize: 12,
  padding: '6px 10px',
  width: 'fit-content'
};

const posterFootnoteStyle = {
  color: sketchColors.muted,
  fontSize: 12,
  lineHeight: 1.5
};

const posterCtaStyle = {
  alignItems: 'center',
  background: sketchColors.accent,
  border: `2px solid ${sketchColors.ink}`,
  borderRadius: 999,
  color: sketchColors.paper,
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
