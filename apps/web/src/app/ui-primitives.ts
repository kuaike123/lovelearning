import type {CSSProperties} from 'react';

type CardOptions = {
  tone?: 'default' | 'elevated' | 'muted';
};

type ButtonOptions = {
  tone?: 'primary' | 'secondary' | 'quiet';
};

type PillOptions = {
  tone?: 'default' | 'accent' | 'success';
};

type SketchCardOptions = {
  tone?: 'default' | 'paper' | 'note' | 'danger';
};

type SketchButtonOptions = {
  tone?: 'primary' | 'secondary' | 'dark' | 'quiet';
};

type SketchPillOptions = {
  tone?: 'default' | 'accent' | 'success' | 'danger' | 'dark';
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

export const sketchColors = {
  accent: '#d9482e',
  danger: '#f4b6a6',
  grid: 'rgba(42,36,29,0.07)',
  ink: '#2a241d',
  muted: '#4c4439',
  note: '#fff096',
  paper: '#fff8df',
  success: '#eaf4d3',
  surface: '#ffffff',
  warm: '#ffef82'
};

export const createSketchGridBackground = (base = sketchColors.paper, opacity = '0.07') =>
  `linear-gradient(rgba(42,36,29,${opacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(42,36,29,${opacity}) 1px, transparent 1px), ${base}`;

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

export const formFieldLabelStyle: CSSProperties = {
  color: uiColors.ink,
  fontSize: 14,
  fontWeight: 700
};

export const formControlStyle: CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${uiColors.borderStrong}`,
  borderRadius: 14,
  color: uiColors.ink,
  fontSize: 15,
  padding: '12px 14px'
};

export const textareaControlStyle: CSSProperties = {
  ...formControlStyle,
  minHeight: 128,
  resize: 'vertical'
};

export const optionGridStyle: CSSProperties = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
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

export const createPillStyle = ({tone = 'default'}: PillOptions = {}): CSSProperties => {
  const base: CSSProperties = {
    alignItems: 'center',
    background: uiColors.surfaceSoft,
    borderRadius: 999,
    color: '#374151',
    display: 'inline-flex',
    fontSize: 12,
    fontWeight: 700,
    gap: 6,
    padding: '6px 10px'
  };

  if (tone === 'accent') {
    return {
      ...base,
      background: '#FFF4CC',
      color: '#7C4A03'
    };
  }

  if (tone === 'success') {
    return {
      ...base,
      background: '#E7F0DA',
      color: '#1F5134'
    };
  }

  return base;
};

export const createSketchPageStyle = (): CSSProperties => ({
  background: createSketchGridBackground('#f8efdc'),
  backgroundSize: '22px 22px',
  color: sketchColors.ink
});

export const createSketchSectionStyle = (): CSSProperties => ({
  ...createSketchPageStyle(),
  border: `3px solid ${sketchColors.ink}`,
  borderRadius: 24,
  boxShadow: `10px 10px 0 ${sketchColors.ink}`,
  margin: '24px 0',
  padding: 28
});

export const createSketchCardStyle = ({tone = 'default'}: SketchCardOptions = {}): CSSProperties => {
  const background =
    tone === 'note'
      ? sketchColors.note
      : tone === 'danger'
        ? sketchColors.danger
        : tone === 'paper'
          ? sketchColors.paper
          : sketchColors.surface;

  return {
    background,
    border: `3px solid ${sketchColors.ink}`,
    borderRadius: 18,
    boxShadow: tone === 'default' ? undefined : `6px 6px 0 ${sketchColors.ink}`,
    color: sketchColors.ink,
    display: 'grid',
    gap: 14,
    padding: 20
  };
};

export const createSketchButtonStyle = ({tone = 'primary'}: SketchButtonOptions = {}): CSSProperties => {
  const background =
    tone === 'primary'
      ? sketchColors.accent
      : tone === 'dark'
        ? sketchColors.ink
        : tone === 'quiet'
          ? sketchColors.note
          : sketchColors.surface;
  const color = tone === 'primary' || tone === 'dark' ? sketchColors.paper : sketchColors.ink;

  return {
    alignItems: 'center',
    background,
    border: `2px solid ${sketchColors.ink}`,
    borderRadius: 999,
    color,
    cursor: 'pointer',
    display: 'inline-flex',
    fontWeight: 800,
    justifyContent: 'center',
    padding: '10px 16px',
    textDecoration: 'none'
  };
};

export const createSketchEyebrowStyle = (): CSSProperties => ({
  color: sketchColors.accent,
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 1.4,
  margin: 0,
  textTransform: 'uppercase'
});

export const createSketchPillStyle = ({tone = 'default'}: SketchPillOptions = {}): CSSProperties => {
  const background =
    tone === 'accent'
      ? sketchColors.note
      : tone === 'success'
        ? sketchColors.success
        : tone === 'danger'
          ? sketchColors.danger
          : tone === 'dark'
            ? sketchColors.ink
            : sketchColors.surface;
  const color = tone === 'dark' ? sketchColors.paper : sketchColors.ink;

  return {
    alignItems: 'center',
    background,
    border: `2px solid ${sketchColors.ink}`,
    borderRadius: 999,
    color,
    display: 'inline-flex',
    fontSize: 12,
    fontWeight: 800,
    gap: 6,
    padding: '6px 10px'
  };
};
