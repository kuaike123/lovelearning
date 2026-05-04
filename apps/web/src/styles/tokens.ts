export type DesignTokenCategory = 'colors' | 'spacing' | 'typography' | 'shadows' | 'radii';

export const designTokens = {
  colors: {
    primary: '#111827',
    primaryHover: '#0F172A',
    secondary: '#F97316',
    secondaryHover: '#EA580C',
    success: '#047857',
    warning: '#B45309',
    danger: '#B91C1C',
    surface: '#FFFFFF',
    surfaceMuted: '#F8FAFC',
    border: '#D1D5DB',
    neutral50: '#F9FAFB',
    neutral100: '#F3F4F6',
    neutral300: '#D1D5DB',
    neutral600: '#4B5563',
    neutral700: '#374151',
    neutral900: '#111827'
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '24px',
    6: '32px',
    7: '48px',
    8: '64px'
  },
  typography: {
    fontBody: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
    fontHeading: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
    sizeSm: '14px',
    sizeMd: '16px',
    sizeLg: '20px',
    sizeXl: '28px',
    lineTight: '1.25',
    lineNormal: '1.6',
    weightRegular: '400',
    weightMedium: '500',
    weightBold: '700'
  },
  shadows: {
    none: 'none',
    low: '0 1px 2px rgba(15, 23, 42, 0.06)',
    medium: '0 12px 28px rgba(15, 23, 42, 0.12)',
    high: '0 24px 56px rgba(15, 23, 42, 0.18)'
  },
  radii: {
    sm: '8px',
    md: '14px',
    lg: '20px',
    full: '999px'
  }
} as const;

export const tokenCssVariables = {
  colorPrimary: '--ll-color-primary',
  colorPrimaryHover: '--ll-color-primary-hover',
  colorSecondary: '--ll-color-secondary',
  colorSurface: '--ll-color-surface',
  colorNeutral900: '--ll-color-neutral-900',
  spacing4: '--ll-spacing-4',
  fontBody: '--ll-font-body',
  shadowMedium: '--ll-shadow-medium',
  radiusMd: '--ll-radius-md'
} as const;
