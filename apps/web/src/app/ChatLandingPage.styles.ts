import type {CSSProperties} from 'react';

import {designTokens} from '../styles/tokens';

const textPrimary = designTokens.colors.neutral900;
const textSecondary = designTokens.colors.neutral600;
const textMuted = designTokens.colors.neutral700;
const surface = designTokens.colors.surface;
const surfaceMuted = designTokens.colors.surfaceMuted;
const border = designTokens.colors.border;

export const mainStyle: CSSProperties = {
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  minHeight: '100vh'
};

export const topbarStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  padding: `${designTokens.spacing[5]} ${designTokens.spacing[6]}`
};

export const productNameStyle: CSSProperties = {
  color: textSecondary,
  fontSize: designTokens.typography.sizeSm,
  fontWeight: designTokens.typography.weightBold
};

export const centerStageStyle: CSSProperties = {
  alignContent: 'center',
  display: 'grid',
  gap: designTokens.spacing[5],
  justifyItems: 'center',
  padding: `${designTokens.spacing[6]} ${designTokens.spacing[5]} 80px`
};

export const heroStyle: CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[3],
  justifyItems: 'center',
  textAlign: 'center'
};

export const titleStyle: CSSProperties = {
  color: textPrimary,
  fontSize: '34px',
  fontWeight: designTokens.typography.weightBold,
  letterSpacing: '-0.03em',
  lineHeight: 1.2,
  margin: 0
};

export const supportStyle: CSSProperties = {
  color: textSecondary,
  fontSize: designTokens.typography.sizeSm,
  margin: 0
};

export const composerStyle: CSSProperties = {
  background: surface,
  border: `2px solid ${textPrimary}`,
  borderRadius: designTokens.radii.lg,
  boxShadow: designTokens.shadows.medium,
  display: 'grid',
  gap: designTokens.spacing[4],
  maxWidth: 820,
  padding: designTokens.spacing[4],
  width: '100%'
};

export const textareaStyle: CSSProperties = {
  border: 0,
  color: '#171717',
  fontFamily: 'inherit',
  fontSize: 17,
  lineHeight: 1.7,
  minHeight: 138,
  outline: 'none',
  resize: 'vertical',
  width: '100%'
};

export const composerControlsStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: designTokens.spacing[3]
};

export const subjectFieldStyle: CSSProperties = {
  alignItems: 'center',
  background: surfaceMuted,
  border: `1px solid ${designTokens.colors.neutral100}`,
  borderRadius: designTokens.radii.md,
  color: textSecondary,
  display: 'inline-flex',
  fontSize: '13px',
  gap: designTokens.spacing[2],
  padding: '7px 9px'
};

export const subjectSelectStyle: CSSProperties = {
  background: surface,
  border: `1px solid ${border}`,
  borderRadius: designTokens.radii.sm,
  color: '#171717',
  fontFamily: 'inherit',
  fontSize: '13px',
  padding: '6px 8px'
};

export const micButtonStyle: CSSProperties = {
  background: surface,
  border: `1px solid ${border}`,
  borderRadius: designTokens.radii.md,
  color: '#171717',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '13px',
  padding: '8px 11px'
};

export const outputTypesStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: designTokens.spacing[2]
};

export const outputTypeStyle: CSSProperties = {
  background: surface,
  border: `1px solid ${border}`,
  borderRadius: designTokens.radii.full,
  color: textSecondary,
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '13px',
  padding: '8px 12px'
};

export const activeOutputTypeStyle: CSSProperties = {
  ...outputTypeStyle,
  background: textPrimary,
  borderColor: textPrimary,
  color: surface
};

export const advancedStyle: CSSProperties = {
  borderTop: `1px solid ${designTokens.colors.neutral100}`,
  paddingTop: designTokens.spacing[3]
};

export const summaryStyle: CSSProperties = {
  color: textSecondary,
  cursor: 'pointer',
  fontSize: designTokens.typography.sizeSm,
  fontWeight: designTokens.typography.weightBold
};

export const settingsGridStyle: CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[3],
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  paddingTop: designTokens.spacing[3]
};

export const fieldStyle: CSSProperties = {
  color: textSecondary,
  display: 'grid',
  fontSize: '12px',
  gap: '6px'
};

export const selectStyle: CSSProperties = {
  background: surface,
  border: `1px solid ${border}`,
  borderRadius: designTokens.radii.md,
  color: '#171717',
  fontFamily: 'inherit',
  fontSize: designTokens.typography.sizeSm,
  padding: '9px 10px'
};

export const submitRowStyle: CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  gap: designTokens.spacing[3],
  justifyContent: 'space-between'
};

export const statusStyle: CSSProperties = {
  color: textMuted,
  fontSize: '13px'
};

export const submitButtonStyle: CSSProperties = {
  background: textPrimary,
  border: 0,
  borderRadius: designTokens.radii.md,
  color: surface,
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: designTokens.typography.weightBold,
  padding: '12px 18px'
};

export const panelStageStyle: CSSProperties = {
  alignContent: 'start',
  display: 'grid',
  gap: designTokens.spacing[4],
  justifySelf: 'center',
  maxWidth: 820,
  padding: '84px 24px',
  width: '100%'
};

export const panelHeaderStyle: CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[2]
};

export const panelTitleStyle: CSSProperties = {
  color: textPrimary,
  fontSize: designTokens.typography.sizeXl,
  fontWeight: designTokens.typography.weightBold,
  letterSpacing: '-0.02em',
  margin: 0
};

export const panelListStyle: CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[3]
};

export const panelCardStyle: CSSProperties = {
  background: surface,
  border: `1px solid ${designTokens.colors.neutral300}`,
  borderRadius: designTokens.radii.md,
  display: 'flex',
  gap: designTokens.spacing[3],
  justifyContent: 'space-between',
  padding: '15px 16px'
};

export const panelCardTitleStyle: CSSProperties = {
  color: '#171717',
  fontSize: '15px',
  fontWeight: 650
};

export const panelMetaStyle: CSSProperties = {
  color: textSecondary,
  fontSize: '13px'
};

export const emptyPanelStyle: CSSProperties = {
  background: surface,
  border: `1px solid ${designTokens.colors.neutral300}`,
  borderRadius: designTokens.radii.md,
  color: textSecondary,
  padding: '18px 16px'
};

export const jobLinkStyle: CSSProperties = {
  ...panelCardStyle,
  color: '#171717',
  textDecoration: 'none'
};

export const jobTitleStackStyle: CSSProperties = {
  display: 'grid',
  gap: designTokens.spacing[1],
  minWidth: 0
};

export const statusBadgeStyle: CSSProperties = {
  alignSelf: 'start',
  background: surfaceMuted,
  borderRadius: designTokens.radii.full,
  color: textSecondary,
  flexShrink: 0,
  fontSize: '12px',
  padding: '5px 9px'
};
