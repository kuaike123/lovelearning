import React from 'react';

import {designTokens} from '../styles/tokens';

type CardElevation = 'low' | 'medium' | 'high';

type CardProps = React.HTMLAttributes<HTMLElement> & {
  elevation?: CardElevation;
  footer?: React.ReactNode;
  header?: React.ReactNode;
};

const elevationShadow: Record<CardElevation, string> = {
  low: designTokens.shadows.low,
  medium: designTokens.shadows.medium,
  high: designTokens.shadows.high
};

export function Card({
  children,
  elevation = 'low',
  footer,
  header,
  style,
  ...props
}: CardProps) {
  return (
    <section
      {...props}
      data-elevation={elevation}
      style={{
        background: designTokens.colors.surface,
        border: `1px solid ${designTokens.colors.border}`,
        borderRadius: designTokens.radii.lg,
        boxShadow: elevationShadow[elevation],
        color: designTokens.colors.neutral900,
        overflow: 'hidden',
        ...style
      }}
    >
      {header ? (
        <div
          data-card-slot="header"
          style={{
            borderBottom: `1px solid ${designTokens.colors.border}`,
            fontWeight: designTokens.typography.weightBold,
            padding: designTokens.spacing[5]
          }}
        >
          {header}
        </div>
      ) : null}
      <div data-card-slot="body" style={{padding: designTokens.spacing[5]}}>
        {children}
      </div>
      {footer ? (
        <div
          data-card-slot="footer"
          style={{
            background: designTokens.colors.surfaceMuted,
            borderTop: `1px solid ${designTokens.colors.border}`,
            padding: designTokens.spacing[4]
          }}
        >
          {footer}
        </div>
      ) : null}
    </section>
  );
}
