import type {CSSProperties} from 'react';

export type ThemeMode = 'professional' | 'creative';

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

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';
type CardElevation = 'flat' | 'low' | 'medium' | 'high';
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

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

export const designTokens = {
  colors: {
    brand: {
      primary: '#C73E1D',
      primaryHover: '#A83318',
      primaryLight: '#E8563A',
      primaryDark: '#8B2A13'
    },
    secondary: {
      main: '#2D5016',
      light: '#5A7C3E',
      lighter: '#8FAA7A',
      dark: '#1A3009'
    },
    neutral: {
      50: '#FAFAF9',
      100: '#F5F5F4',
      200: '#E7E5E4',
      300: '#D6D3D1',
      400: '#A8A29E',
      500: '#78716C',
      600: '#57534E',
      700: '#44403C',
      800: '#292524',
      900: '#1C1917'
    },
    success: {
      main: '#16A34A',
      light: '#22C55E',
      dark: '#15803D',
      bg: '#F0FDF4'
    },
    warning: {
      main: '#EA580C',
      light: '#FB923C',
      dark: '#C2410C',
      bg: '#FFF7ED'
    },
    error: {
      main: '#DC2626',
      light: '#EF4444',
      dark: '#B91C1C',
      bg: '#FEF2F2'
    },
    info: {
      main: '#0284C7',
      light: '#0EA5E9',
      dark: '#0369A1',
      bg: '#F0F9FF'
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#FAFAF9',
      tertiary: '#F5F5F4'
    }
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem'
  },
  borderRadius: {
    none: '0',
    sm: '0.375rem',
    base: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px'
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
  },
  fonts: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const;

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

export const createProfessionalButtonStyle = (
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md'
): CSSProperties => {
  const baseStyle: CSSProperties = {
    alignItems: 'center',
    borderRadius: designTokens.borderRadius.lg,
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: designTokens.fonts.sans,
    fontWeight: designTokens.fontWeight.semibold,
    justifyContent: 'center',
    textDecoration: 'none',
    transition: `all ${designTokens.transitions.base}`,
    border: 'none',
    outline: 'none'
  };

  const sizeStyles: Record<ButtonSize, CSSProperties> = {
    sm: {
      fontSize: designTokens.fontSize.sm,
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
      height: '32px'
    },
    md: {
      fontSize: designTokens.fontSize.base,
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[5]}`,
      height: '40px'
    },
    lg: {
      fontSize: designTokens.fontSize.lg,
      padding: `${designTokens.spacing[4]} ${designTokens.spacing[6]}`,
      height: '48px'
    }
  };

  const variantStyles: Record<ButtonVariant, CSSProperties> = {
    primary: {
      background: designTokens.colors.brand.primary,
      color: '#FFFFFF',
      boxShadow: designTokens.shadows.sm
    },
    secondary: {
      background: designTokens.colors.secondary.main,
      color: '#FFFFFF',
      boxShadow: designTokens.shadows.sm
    },
    outline: {
      background: 'transparent',
      border: `2px solid ${designTokens.colors.neutral[300]}`,
      color: designTokens.colors.neutral[700]
    },
    ghost: {
      background: 'transparent',
      color: designTokens.colors.neutral[700]
    },
    danger: {
      background: designTokens.colors.error.main,
      color: '#FFFFFF',
      boxShadow: designTokens.shadows.sm
    }
  };

  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant]
  };
};

export const createProfessionalCardStyle = (elevation: CardElevation = 'low'): CSSProperties => {
  const baseStyle: CSSProperties = {
    background: designTokens.colors.background.primary,
    borderRadius: designTokens.borderRadius.xl,
    display: 'grid',
    gap: designTokens.spacing[4],
    padding: designTokens.spacing[6],
    transition: `all ${designTokens.transitions.base}`
  };

  const elevationStyles: Record<CardElevation, CSSProperties> = {
    flat: {
      border: `1px solid ${designTokens.colors.neutral[200]}`,
      boxShadow: 'none'
    },
    low: {
      border: `1px solid ${designTokens.colors.neutral[200]}`,
      boxShadow: designTokens.shadows.sm
    },
    medium: {
      border: 'none',
      boxShadow: designTokens.shadows.md
    },
    high: {
      border: 'none',
      boxShadow: designTokens.shadows.xl
    }
  };

  return {
    ...baseStyle,
    ...elevationStyles[elevation]
  };
};

export const createInputStyle = (): CSSProperties => ({
  background: designTokens.colors.background.primary,
  border: `1px solid ${designTokens.colors.neutral[300]}`,
  borderRadius: designTokens.borderRadius.md,
  color: designTokens.colors.neutral[900],
  fontFamily: designTokens.fonts.sans,
  fontSize: designTokens.fontSize.base,
  lineHeight: designTokens.lineHeight.normal,
  outline: 'none',
  padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
  transition: `all ${designTokens.transitions.base}`,
  width: '100%'
});

export const createLabelStyle = (): CSSProperties => ({
  color: designTokens.colors.neutral[700],
  display: 'block',
  fontFamily: designTokens.fonts.sans,
  fontSize: designTokens.fontSize.sm,
  fontWeight: designTokens.fontWeight.medium,
  marginBottom: designTokens.spacing[2]
});

export const createBadgeStyle = (variant: BadgeVariant = 'default'): CSSProperties => {
  const baseStyle: CSSProperties = {
    alignItems: 'center',
    borderRadius: designTokens.borderRadius.full,
    display: 'inline-flex',
    fontSize: designTokens.fontSize.xs,
    fontWeight: designTokens.fontWeight.semibold,
    gap: designTokens.spacing[1],
    padding: `${designTokens.spacing[1]} ${designTokens.spacing[3]}`,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const variantStyles: Record<BadgeVariant, CSSProperties> = {
    default: {
      background: designTokens.colors.neutral[100],
      color: designTokens.colors.neutral[700]
    },
    success: {
      background: designTokens.colors.success.bg,
      color: designTokens.colors.success.dark
    },
    warning: {
      background: designTokens.colors.warning.bg,
      color: designTokens.colors.warning.dark
    },
    error: {
      background: designTokens.colors.error.bg,
      color: designTokens.colors.error.dark
    },
    info: {
      background: designTokens.colors.info.bg,
      color: designTokens.colors.info.dark
    }
  };

  return {
    ...baseStyle,
    ...variantStyles[variant]
  };
};

export const getThemeColors = (mode: ThemeMode) => {
  if (mode === 'creative') {
    return {
      accent: '#d9482e',
      danger: '#f4b6a6',
      ink: '#2a241d',
      muted: '#4c4439',
      note: '#fff096',
      paper: '#fff8df',
      success: '#eaf4d3',
      warm: '#ffef82'
    };
  }

  return designTokens.colors;
};

export const keyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
