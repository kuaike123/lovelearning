import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {Navigation} from '../../apps/web/src/components/Navigation';

const items = [
  {href: '/', id: 'create', label: '新建会话'},
  {href: '/?view=jobs', id: 'jobs', label: '历史任务'},
  {href: '/?view=samples', id: 'samples', label: '样片库'}
];

describe('Navigation', () => {
  it('renders desktop sidebar navigation with the current location highlighted', () => {
    const html = renderToStaticMarkup(
      <Navigation brand="LoveLearning AI" currentId="jobs" items={items} />
    );

    expect(html).toContain('data-navigation="app-shell"');
    expect(html).toContain('data-navigation-region="desktop-sidebar"');
    expect(html).toContain('LoveLearning AI');
    expect(html).toContain('href="/?view=jobs"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('data-navigation-active="true"');
  });

  it('renders mobile hamburger and bottom navigation affordances', () => {
    const html = renderToStaticMarkup(
      <Navigation brand="LoveLearning AI" currentId="create" items={items} />
    );

    expect(html).toContain('data-navigation-region="mobile-topbar"');
    expect(html).toContain('aria-label="打开导航菜单"');
    expect(html).toContain('data-navigation-region="mobile-drawer"');
    expect(html).toContain('data-navigation-region="mobile-bottom"');
    expect(html).toContain('transition:transform 200ms ease');
  });

  it('keeps navigation depth to one level in rendered links', () => {
    const html = renderToStaticMarkup(
      <Navigation
        brand="LoveLearning AI"
        currentId="samples"
        items={items}
        secondaryItems={[{href: '/?view=settings', id: 'settings', label: '设置'}]}
      />
    );

    expect(html).toContain('data-navigation-depth="1"');
    expect(html).not.toContain('data-navigation-depth="3"');
    expect(html).toContain('设置');
  });
});
