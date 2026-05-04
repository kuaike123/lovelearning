import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {Card} from '../../apps/web/src/components/Card';
import {designTokens} from '../../apps/web/src/styles/tokens';

describe('Card', () => {
  it('renders low, medium, and high elevations with token shadows', () => {
    const html = renderToStaticMarkup(
      <div>
        <Card elevation="low">低层级</Card>
        <Card elevation="medium">中层级</Card>
        <Card elevation="high">高层级</Card>
      </div>
    );

    expect(html).toContain('data-elevation="low"');
    expect(html).toContain('data-elevation="medium"');
    expect(html).toContain('data-elevation="high"');
    expect(html).toContain(`box-shadow:${designTokens.shadows.low}`);
    expect(html).toContain(`box-shadow:${designTokens.shadows.medium}`);
    expect(html).toContain(`box-shadow:${designTokens.shadows.high}`);
  });

  it('renders optional header, body, and footer slots conditionally', () => {
    const fullCard = renderToStaticMarkup(
      <Card header="任务设置" footer={<button type="button">继续</button>}>
        表单内容
      </Card>
    );
    const bodyOnly = renderToStaticMarkup(<Card>仅内容</Card>);

    expect(fullCard).toContain('data-card-slot="header"');
    expect(fullCard).toContain('任务设置');
    expect(fullCard).toContain('data-card-slot="body"');
    expect(fullCard).toContain('表单内容');
    expect(fullCard).toContain('data-card-slot="footer"');
    expect(fullCard).toContain('继续');
    expect(bodyOnly).not.toContain('data-card-slot="header"');
    expect(bodyOnly).not.toContain('data-card-slot="footer"');
  });
});
