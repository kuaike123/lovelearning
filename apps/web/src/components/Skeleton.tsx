import React from 'react';

import {designTokens} from '../styles/tokens';

type SkeletonProps = {
  height: number;
  radius?: string;
  width: number | string;
};

export function Skeleton({height, radius = designTokens.radii.md, width}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      data-loading-state="skeleton"
      style={{
        animation: 'skeleton-pulse 1200ms ease-in-out infinite',
        background: `linear-gradient(90deg, ${designTokens.colors.neutral100}, ${designTokens.colors.neutral300}, ${designTokens.colors.neutral100})`,
        borderRadius: radius,
        height,
        width
      }}
    >
      <style>{`
@keyframes skeleton-pulse {
  0% { opacity: 0.68; }
  50% { opacity: 1; }
  100% { opacity: 0.68; }
}
`}</style>
    </div>
  );
}
