import React from 'react';

import {designTokens} from '../styles/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: designTokens.colors.primary,
    border: `1px solid ${designTokens.colors.primary}`,
    color: designTokens.colors.surface
  },
  secondary: {
    background: designTokens.colors.surface,
    border: `1px solid ${designTokens.colors.border}`,
    color: designTokens.colors.primary
  },
  tertiary: {
    background: 'transparent',
    border: '1px solid transparent',
    color: designTokens.colors.neutral700
  }
};

export function Button({
  children,
  disabled = false,
  onClick,
  onKeyDown,
  style,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
    }
  };

  return (
    <button
      {...props}
      aria-disabled={disabled}
      data-variant={variant}
      disabled={disabled}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={{
        alignItems: 'center',
        borderRadius: designTokens.radii.md,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        fontWeight: designTokens.typography.weightBold,
        gap: designTokens.spacing[2],
        justifyContent: 'center',
        lineHeight: designTokens.typography.lineTight,
        minHeight: '44px',
        minWidth: '44px',
        opacity: disabled ? 0.56 : 1,
        padding: `${designTokens.spacing[3]} ${designTokens.spacing[5]}`,
        transition: 'background-color 160ms ease, border-color 160ms ease, opacity 160ms ease',
        ...variantStyles[variant],
        ...style
      }}
      type={type}
    >
      {children}
    </button>
  );
}
