import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import SampleDetailPage from '../../apps/web/src/app/samples/[slug]/page';

describe('SampleDetailPage', () => {
  it('renders a dedicated featured sample page with generation links', async () => {
    const html = renderToStaticMarkup(
      await SampleDetailPage({params: Promise.resolve({slug: 'linear-equation-basic'})})
    );

    expect(html).toContain('\u6837\u7247\u8be6\u60c5');
    expect(html).toContain('\u521d\u4e00\u65b9\u7a0b\u6807\u51c6\u8bb2\u89e3');
    expect(html).toContain('\u63a8\u8350\u6307\u6570');
    expect(html).toContain('\u9002\u5408\u5e74\u7ea7');
    expect(html).toContain('\u8f6c\u5316\u573a\u666f');
    expect(html).toContain('\u53d1\u5e03\u65f6\u95f4');
    expect(html).toContain('\u5c01\u9762\u9884\u89c8');
    expect(html).toContain('\u6210\u7247\u9884\u671f');
    expect(html).toContain('data-poster-cta="detail"');
    expect(html).toContain('\u65b9\u7a0b\u8bb2\u89e3');
    expect(html).toContain('\u8bb2\u5e08\u53e3\u64ad\u5356\u70b9');
    expect(html).toContain('\u8bb2\u89e3\u4eae\u70b9');
    expect(html).toContain('\u9002\u7528\u573a\u666f');
    expect(html).toContain('\u6837\u7247\u5de5\u4f5c\u53f0');
    expect(html).toContain('\u590d\u5236\u9898\u76ee');
    expect(html).toContain('\u4e00\u952e\u751f\u6210\u540c\u6b3e');
    expect(html).toContain('\u4e0a\u4e00\u6761\u6837\u7247');
    expect(html).toContain('\u4e0b\u4e00\u6761\u6837\u7247');
    expect(html).toContain('data-sample-page="1 / 2"');
    expect(html).toContain('\u5f53\u524d\u6d4f\u89c8');
    expect(html).toContain('\u76f8\u5173\u63a8\u8350');
    expect(html).toContain('\u7ee7\u7eed\u6d4f\u89c8');
    expect(html).toContain('\u8fd4\u56de\u6837\u7247\u5e93');
    expect(html).toContain('data-related-poster="quantity-relation-word-problem"');
    expect(html).toContain('data-poster-cta="thumbnail"');
    expect(html).toContain('href="/#featured-samples"');
    expect(html).toContain('href="/samples/quantity-relation-word-problem"');
    expect(html).toContain('taskName=');
  });
});
