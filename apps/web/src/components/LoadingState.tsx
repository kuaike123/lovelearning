import React from 'react';

import {designTokens} from '../styles/tokens';

type LoadingStateProps = {
  label: string;
};

export function LoadingState({label}: LoadingStateProps) {
  return (
    <div aria-busy="true" data-loading-feedback="action" role="status" style={containerStyle}>
      <span aria-hidden="true" style={dotStyle} />
      {label}
    </div>
  );
}

const containerStyle = {
  alignItems: 'center',
  color: designTokens.colors.neutral700,
  display: 'inline-flex',
  gap: designTokens.spacing[2],
  minHeight: '44px'
};

const dotStyle = {
  animation: 'skeleton-pulse 1200ms ease-in-out infinite',
  background: designTokens.colors.secondary,
  borderRadius: designTokens.radii.full,
  display: 'inline-block',
  height: 10,
  width: 10
};
