import React from 'react';
import {describe, expect, it} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';

import HomePage from '../../apps/web/src/app/page';
import {getProblemTemplates} from '../../packages/lesson-engine/src/problem-templates';

describe('HomePage', () => {
  it('shows the problem input form with readable Chinese copy', () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain('\u6570\u5b66\u8bb2\u89e3\u89c6\u9891\u751f\u6210\u5668');
    expect(html).toContain('\u9898\u76ee\u5185\u5bb9');
    expect(html).toContain('\u89e3\u65b9\u7a0b\uff1a2x + 3 = 11');
    expect(html).toContain('\u751f\u6210\u89c6\u9891');
  });

  it('shows V1 supported scope and clickable example problems', () => {
    const html = renderToStaticMarkup(<HomePage />);
    const templates = getProblemTemplates();
    const examples = templates.flatMap((template) => template.examples);

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
});
