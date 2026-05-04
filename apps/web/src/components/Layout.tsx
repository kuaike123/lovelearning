import React from 'react';

import {designTokens} from '../styles/tokens';

export type ResponsiveLayoutMode = 'desktop' | 'mobile' | 'tablet';

type AppLayoutProps = {
  children: React.ReactNode;
  navigation: React.ReactNode;
};

type TouchTargetInput = {
  height: number;
  viewportWidth: number;
  width: number;
};

export function AppLayout({children, navigation}: AppLayoutProps) {
  return (
    <main data-layout="responsive-app" style={layoutStyle}>
      <style>{layoutCss}</style>
      <div data-layout-region="navigation">{navigation}</div>
      <section data-layout-region="content" style={contentStyle}>
        {children}
      </section>
    </main>
  );
}

export const getResponsiveLayoutMode = (viewportWidth: number): ResponsiveLayoutMode => {
  if (viewportWidth < 768) return 'mobile';
  if (viewportWidth <= 1024) return 'tablet';

  return 'desktop';
};

export const hasMinimumTouchTarget = ({height, viewportWidth, width}: TouchTargetInput) => {
  if (getResponsiveLayoutMode(viewportWidth) !== 'mobile') {
    return true;
  }

  return width >= 44 && height >= 44;
};

export const preventsHorizontalOverflow = (_content: string) => ({
  maxWidth: '100%',
  minWidth: 0,
  overflowWrap: 'anywhere',
  wordBreak: 'break-word'
});

const layoutCss = `
[data-layout="responsive-app"] {
  grid-template-columns:220px minmax(0, 1fr);
}

[data-layout-region="content"] {
  min-width: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}

[data-layout="responsive-app"] :focus-visible {
  outline: 2px solid #F97316;
  outline-offset: 2px;
}

@media (max-width: 767px) {
  [data-layout="responsive-app"] {
    grid-template-columns:minmax(0, 1fr);
    padding-bottom: 72px;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  [data-layout="responsive-app"] {
    grid-template-columns:180px minmax(0, 1fr);
  }
}
`;

const layoutStyle = {
  background: designTokens.colors.surfaceMuted,
  color: designTokens.colors.neutral900,
  display: 'grid',
  fontFamily: designTokens.typography.fontBody,
  minHeight: '100vh',
  minWidth: 0,
  transition: 'grid-template-columns 260ms ease'
};

const contentStyle = {
  minHeight: '100vh',
  minWidth: 0
};
