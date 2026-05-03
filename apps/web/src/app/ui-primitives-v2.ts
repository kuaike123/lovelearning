/**
 * UI Primitives V2 - 专业模式设计系统
 * 提供更现代、专业的视觉风格,同时保留创意模式选项
 */

import type {CSSProperties} from 'react';

// ============================================================================
// 设计令牌 (Design Tokens)
// ============================================================================

export const designTokens = {
  // 色彩系统
  colors: {
    // 品牌色
    brand: {
      primary: '#C73E1D',
      primaryHover: '#A83318',
      primaryLight: '#E8563A',
      primaryDark: '#8B2A13',
    },
    
    // 辅助色
    secondary: {
      main: '#2D5016',
      light: '#5A7C3E',
      lighter: '#8FAA7A',
      dark: '#1A3009',
    },
    
    // 中性色
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
      900: '#1C1917',
    },
    
    // 功能色
    success: {
      main: '#16A34A',
      light: '#22C55E',
      dark: '#15803D',
      bg: '#F0FDF4',
    },
    warning: {
      main: '#EA580C',
      light: '#FB923C',
      dark: '#C2410C',
      bg: '#FFF7ED',
    },
    error: {
      main: '#DC2626',
      light: '#EF4444',
      dark: '#B91C1C',
      bg: '#FEF2F2',
    },
    info: {
      main: '#0284C7',
      light: '#0EA5E9',
      dark: '#0369A1',
      bg: '#F0F9FF',
    },
    
    // 背景色
    background: {
      primary: '#FFFFFF',
      secondary: '#FAFAF9',
      tertiary: '#F5F5F4',
    },
  },
  
  // 间距系统 (8px 基准)
  spacing: {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
  },
  
  // 圆角
  borderRadius: {
    none: '0',
    sm: '0.375rem',   // 6px
    base: '0.5rem',   // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    '2xl': '2rem',    // 32px
    full: '9999px',
  },
  
  // 阴影
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  },
  
  // 字体
  fonts: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  
  // 字体大小
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  // 字重
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // 行高
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // 过渡
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ============================================================================
// 组件样式工厂函数
// ============================================================================

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export const createButtonStyle = (
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
    outline: 'none',
  };
  
  // 尺寸变体
  const sizeStyles: Record<ButtonSize, CSSProperties> = {
    sm: {
      fontSize: designTokens.fontSize.sm,
      padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
      height: '32px',
    },
    md: {
      fontSize: designTokens.fontSize.base,
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[5]}`,
      height: '40px',
    },
    lg: {
      fontSize: designTokens.fontSize.lg,
      padding: `${designTokens.spacing[4]} ${designTokens.spacing[6]}`,
      height: '48px',
    },
  };
  
  // 颜色变体
  const variantStyles: Record<ButtonVariant, CSSProperties> = {
    primary: {
      background: designTokens.colors.brand.primary,
      color: '#FFFFFF',
      boxShadow: designTokens.shadows.sm,
    },
    secondary: {
      background: designTokens.colors.secondary.main,
      color: '#FFFFFF',
      boxShadow: designTokens.shadows.sm,
    },
    outline: {
      background: 'transparent',
      border: `2px solid ${designTokens.colors.neutral[300]}`,
      color: designTokens.colors.neutral[700],
    },
    ghost: {
      background: 'transparent',
      color: designTokens.colors.neutral[700],
    },
    danger: {
      background: designTokens.colors.error.main,
      color: '#FFFFFF',
      boxShadow: designTokens.shadows.sm,
    },
  };
  
  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

type CardElevation = 'flat' | 'low' | 'medium' | 'high';

export const createCardStyle = (elevation: CardElevation = 'low'): CSSProperties => {
  const baseStyle: CSSProperties = {
    background: designTokens.colors.background.primary,
    borderRadius: designTokens.borderRadius.xl,
    display: 'grid',
    gap: designTokens.spacing[4],
    padding: designTokens.spacing[6],
    transition: `all ${designTokens.transitions.base}`,
  };
  
  const elevationStyles: Record<CardElevation, CSSProperties> = {
    flat: {
      border: `1px solid ${designTokens.colors.neutral[200]}`,
      boxShadow: 'none',
    },
    low: {
      border: `1px solid ${designTokens.colors.neutral[200]}`,
      boxShadow: designTokens.shadows.sm,
    },
    medium: {
      border: 'none',
      boxShadow: designTokens.shadows.md,
    },
    high: {
      border: 'none',
      boxShadow: designTokens.shadows.xl,
    },
  };
  
  return {
    ...baseStyle,
    ...elevationStyles[elevation],
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
  width: '100%',
});

export const createLabelStyle = (): CSSProperties => ({
  color: designTokens.colors.neutral[700],
  display: 'block',
  fontFamily: designTokens.fonts.sans,
  fontSize: designTokens.fontSize.sm,
  fontWeight: designTokens.fontWeight.medium,
  marginBottom: designTokens.spacing[2],
});

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

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
    letterSpacing: '0.05em',
  };
  
  const variantStyles: Record<BadgeVariant, CSSProperties> = {
    default: {
      background: designTokens.colors.neutral[100],
      color: designTokens.colors.neutral[700],
    },
    success: {
      background: designTokens.colors.success.bg,
      color: designTokens.colors.success.dark,
    },
    warning: {
      background: designTokens.colors.warning.bg,
      color: designTokens.colors.warning.dark,
    },
    error: {
      background: designTokens.colors.error.bg,
      color: designTokens.colors.error.dark,
    },
    info: {
      background: designTokens.colors.info.bg,
      color: designTokens.colors.info.dark,
    },
  };
  
  return {
    ...baseStyle,
    ...variantStyles[variant],
  };
};

// ============================================================================
// 布局组件样式
// ============================================================================

export const createContainerStyle = (maxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'xl'): CSSProperties => {
  const maxWidths = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    full: '100%',
  };
  
  return {
    margin: '0 auto',
    maxWidth: maxWidths[maxWidth],
    padding: `0 ${designTokens.spacing[4]}`,
    width: '100%',
  };
};

export const createStackStyle = (gap: keyof typeof designTokens.spacing = 4): CSSProperties => ({
  display: 'grid',
  gap: designTokens.spacing[gap],
});

export const createGridStyle = (
  columns: number = 3,
  gap: keyof typeof designTokens.spacing = 4
): CSSProperties => ({
  display: 'grid',
  gap: designTokens.spacing[gap],
  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
});

// ============================================================================
// 响应式工具
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
};

// ============================================================================
// 动画工具
// ============================================================================

export const animations = {
  fadeIn: {
    animation: 'fadeIn 200ms ease-in',
  },
  slideUp: {
    animation: 'slideUp 300ms ease-out',
  },
  scaleIn: {
    animation: 'scaleIn 200ms ease-out',
  },
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

// ============================================================================
// 主题切换支持
// ============================================================================

export type ThemeMode = 'professional' | 'creative';

export const getThemeColors = (mode: ThemeMode) => {
  if (mode === 'creative') {
    // 保留原有的创意风格色彩
    return {
      accent: '#d9482e',
      danger: '#f4b6a6',
      ink: '#2a241d',
      muted: '#4c4439',
      note: '#fff096',
      paper: '#fff8df',
      success: '#eaf4d3',
      warm: '#ffef82',
    };
  }
  
  // 专业模式使用新的色彩系统
  return designTokens.colors;
};
