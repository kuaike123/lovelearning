import type {CSSProperties} from 'react';

type CardOptions = {
  tone?: 'default' | 'elevated' | 'muted';
};

type ButtonOptions = {
  tone?: 'primary' | 'secondary' | 'quiet';
};

export const uiColors = {
  border: '#eadfca',
  borderStrong: '#d7c8a9',
  canvas: '#fbf7ef',
  ink: '#1f2937',
  muted: '#6b7280',
  primary: '#102A43',
  secondary: '#6f7d45',
  surface: '#fffaf1',
  surfaceSoft: '#f1ead9',
  warm: '#fff7d6'
};

export const appShellStyle: CSSProperties = {
  background: 'linear-gradient(180deg, #f7f1e3 0%, #fffdf8 26%, #fff9ef 100%)',
  minHeight: '100vh',
  padding: '32px 20px 64px'
};

export const contentShellStyle: CSSProperties = {
  display: 'grid',
  gap: 28,
  margin: '0 auto',
  maxWidth: 1280
};

export const workspaceGridStyle: CSSProperties = {
  alignItems: 'start',
  display: 'grid',
  gap: 24,
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
};

export const sectionIntroStyle: CSSProperties = {
  display: 'grid',
  gap: 8
};

export const createCardStyle = ({tone = 'default'}: CardOptions = {}): CSSProperties => {
  const base: CSSProperties = {
    background: uiColors.surface,
    border: `1px solid ${uiColors.border}`,
    borderRadius: 20,
    display: 'grid',
    gap: 14,
    padding: 20
  };

  if (tone === 'elevated') {
    return {
      ...base,
      background: 'rgba(255,255,255,0.88)',
      borderRadius: 28,
      boxShadow: '0 18px 50px rgba(16, 42, 67, 0.08)'
    };
  }

  if (tone === 'muted') {
    return {
      ...base,
      background: uiColors.surfaceSoft,
      borderColor: uiColors.borderStrong
    };
  }

  return base;
};

export const createButtonStyle = ({tone = 'primary'}: ButtonOptions = {}): CSSProperties => {
  const base: CSSProperties = {
    borderRadius: 999,
    cursor: 'pointer',
    display: 'inline-flex',
    fontWeight: 700,
    justifyContent: 'center',
    padding: '10px 16px',
    textDecoration: 'none'
  };

  if (tone === 'secondary') {
    return {
      ...base,
      background: '#ffffff',
      border: `1px solid ${uiColors.borderStrong}`,
      color: uiColors.ink
    };
  }

  if (tone === 'quiet') {
    return {
      ...base,
      background: uiColors.warm,
      border: `1px solid ${uiColors.border}`,
      color: uiColors.ink
    };
  }

  return {
    ...base,
    background: uiColors.primary,
    border: `1px solid ${uiColors.primary}`,
    color: '#ffffff'
  };
};

export const createEyebrowStyle = (): CSSProperties => ({
  color: uiColors.secondary,
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 1.4,
  margin: 0
});
