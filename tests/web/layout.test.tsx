import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {
  AppLayout,
  getResponsiveLayoutMode,
  hasMinimumTouchTarget,
  preventsHorizontalOverflow
} from '../../apps/web/src/components/Layout';

describe('Layout responsive utilities', () => {
  it('maps viewport widths to mobile, tablet, and desktop modes', () => {
    expect(getResponsiveLayoutMode(320)).toBe('mobile');
    expect(getResponsiveLayoutMode(767)).toBe('mobile');
    expect(getResponsiveLayoutMode(768)).toBe('tablet');
    expect(getResponsiveLayoutMode(1024)).toBe('tablet');
    expect(getResponsiveLayoutMode(1025)).toBe('desktop');
  });

  it('keeps mobile touch targets at least 44x44px', () => {
    for (const width of [320, 375, 414, 767]) {
      expect(hasMinimumTouchTarget({height: 44, viewportWidth: width, width: 44})).toBe(true);
      expect(hasMinimumTouchTarget({height: 40, viewportWidth: width, width: 44})).toBe(false);
    }
  });

  it('uses overflow-safe text layout for long content', () => {
    expect(preventsHorizontalOverflow('x'.repeat(200))).toMatchObject({
      overflowWrap: 'anywhere',
      wordBreak: 'break-word'
    });
  });
});

describe('AppLayout', () => {
  it('renders responsive grid regions with mobile and tablet breakpoints', () => {
    const html = renderToStaticMarkup(
      <AppLayout navigation={<nav>导航</nav>}>
        <section>内容</section>
      </AppLayout>
    );

    expect(html).toContain('data-layout="responsive-app"');
    expect(html).toContain('data-layout-region="navigation"');
    expect(html).toContain('data-layout-region="content"');
    expect(html).toContain('@media (max-width: 767px)');
    expect(html).toContain('@media (min-width: 768px) and (max-width: 1024px)');
    expect(html).toContain('grid-template-columns:minmax(0, 1fr)');
    expect(html).toContain('grid-template-columns:220px minmax(0, 1fr)');
  });
});
