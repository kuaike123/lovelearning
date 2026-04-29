import React from 'react';
import {describe, expect, it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';

import HomePage from '../../apps/web/src/app/page';
import {getProblemTemplates} from '../../packages/lesson-engine/src/problem-templates';

describe('HomePage', () => {
  it('shows the problem input form with readable Chinese copy', async () => {
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain('data-home-layout="workspace"');
    expect(html).toContain('\u4e2d\u5c0f\u5b66\u6559\u57f9\u89c6\u9891\u5de5\u5382');
    expect(html).toContain('\u4ece\u9898\u76ee\u5230\u77ed\u89c6\u9891');
    expect(html).toContain('\u5de5\u4f5c\u533a\u5207\u6362');
    expect(html).toContain('data-home-entry="create"');
    expect(html).toContain('data-home-entry="samples"');
    expect(html).toContain('data-home-entry="jobs"');
    expect(html).toContain('data-home-panel="create"');
    expect(html).toContain('data-home-illustration="create"');
    expect(html).toContain('data-home-motion="panel-hero"');
    expect(html).toContain('\u9898\u76ee\u5185\u5bb9');
    expect(html).toContain('\u89e3\u65b9\u7a0b\uff1a2x + 3 = 11');
    expect(html).toContain('\u751f\u6210\u89c6\u9891');
  });

  it('shows V1 supported scope and clickable example problems in jobs panel', async () => {
    const html = renderToStaticMarkup(
      await HomePage({
        searchParams: Promise.resolve({view: 'jobs'})
      })
    );
    const templates = getProblemTemplates();
    const examples = templates.flatMap((template) => template.examples);

    expect(html).toContain('data-home-illustration="jobs"');
    expect(html).toContain('\u5f53\u524d V1 \u652f\u6301');
    expect(html).toContain('\u4e00\u952e\u586b\u5165\u793a\u4f8b');

    for (const template of templates) {
      expect(html).toContain(template.label);
      expect(html).toContain(template.description);
    }

    for (const example of examples) {
      expect(html).toContain(`href="/?content=${encodeURIComponent(example)}"`);
      expect(html).toContain(example);
    }
  });

  it('shows a featured sample showcase with one-click preset links in samples panel', async () => {
    const html = renderToStaticMarkup(
      await HomePage({
        searchParams: Promise.resolve({view: 'samples'})
      })
    );

    expect(html).toContain('data-home-illustration="samples"');
    expect(html).toContain('\u7cbe\u9009\u6837\u7247');
    expect(html).toContain('\u4e3b\u63a8\u6837\u7247');
    expect(html).toContain('\u5168\u90e8\u6837\u7247');
    expect(html).toContain('id="featured-samples"');
    expect(html).toContain('\u4e00\u952e\u751f\u6210\u540c\u6b3e');
    expect(html).toContain('\u521d\u4e00\u65b9\u7a0b\u6807\u51c6\u8bb2\u89e3');
    expect(html).toContain('\u6837\u7247\u7b5b\u9009');
    expect(html).toContain('\u6309\u9898\u578b\u770b');
    expect(html).toContain('\u6309\u7528\u9014\u770b');
    expect(html).toContain('\u65b9\u7a0b');
    expect(html).toContain('\u62db\u751f');
    expect(html).toContain('\u63a8\u8350\u6307\u6570');
    expect(html).toContain('\u9002\u5408\u5e74\u7ea7');
    expect(html).toContain('\u8f6c\u5316\u573a\u666f');
    expect(html).toContain('\u5c01\u9762\u9884\u89c8');
    expect(html).toContain('\u6210\u7247\u9884\u671f');
    expect(html).toContain('href="/samples/linear-equation-basic"');
    expect(html).toContain('\u67e5\u770b\u6837\u7247\u8be6\u60c5');
    expect(html).toContain('taskName=');
    expect(html).toContain('targetDurationSec=');
    expect(html).not.toContain('\u9002\u7528\u573a\u666f');
    expect(html).not.toContain('\u8bb2\u89e3\u4eae\u70b9');
  });

  it('derives recommended voice defaults from the selected problem context when query params omit them', async () => {
    const html = renderToStaticMarkup(
      await HomePage({
        searchParams: Promise.resolve({
          content: '已知两数和为12，其中一个数是另一个数的2倍，求这两个数。',
          style: 'exam',
          targetDurationSec: '60'
        })
      })
    );

    expect(html).toContain('option value="exam" selected=""');
    expect(html).toContain('option value="60" selected=""');
    expect(html).toContain('option value="female_clear" selected=""');
    expect(html).toContain('option value="fast" selected=""');
    expect(html).toContain('\u63a8\u8350\u8bed\u901f');
    expect(html).toContain('\u8bb2\u89e3\u8bed\u6c14');
  });
});
