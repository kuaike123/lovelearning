import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {SubmitJobForm} from '../../apps/web/src/app/SubmitJobForm';

describe('SubmitJobForm', () => {
  it('renders the query-provided problem text with readable Chinese copy', () => {
    const html = renderToStaticMarkup(
      <SubmitJobForm initialContent="Solve equation: 2x + 3 = 11" />
    );

    expect(html).toContain('Solve equation: 2x + 3 = 11');
    expect(html).toContain('\u4efb\u52a1\u540d\u79f0');
    expect(html).toContain('\u751f\u6210\u89c6\u9891');
  });

  it('renders generation option controls for teacher-facing requests', () => {
    const html = renderToStaticMarkup(
      <SubmitJobForm initialContent="Solve equation: 2x + 3 = 11" />
    );

    expect(html).toContain('\u9002\u7528\u5e74\u7ea7');
    expect(html).toContain('name="grade"');
    expect(html).toContain('\u76ee\u6807\u65f6\u957f');
    expect(html).toContain('name="targetDurationSec"');
    expect(html).toContain('\u8bb2\u89e3\u98ce\u683c');
    expect(html).toContain('name="style"');
    expect(html).toContain('\u914d\u97f3\u97f3\u8272');
    expect(html).toContain('name="voice"');
  });
});
