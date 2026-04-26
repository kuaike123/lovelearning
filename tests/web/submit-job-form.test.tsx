import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {SubmitJobForm} from '../../apps/web/src/app/SubmitJobForm';

describe('SubmitJobForm', () => {
  it('renders the query-provided problem text', () => {
    const html = renderToStaticMarkup(
      <SubmitJobForm initialContent="Solve equation: 2x + 3 = 11" />
    );

    expect(html).toContain('Solve equation: 2x + 3 = 11');
    expect(html).toContain('任务名称');
    expect(html).toContain('生成视频');
  });

  it('renders generation option controls for teacher-facing requests', () => {
    const html = renderToStaticMarkup(
      <SubmitJobForm initialContent="Solve equation: 2x + 3 = 11" />
    );

    expect(html).toContain('适用年级');
    expect(html).toContain('name="grade"');
    expect(html).toContain('目标时长');
    expect(html).toContain('name="targetDurationSec"');
    expect(html).toContain('讲解风格');
    expect(html).toContain('name="style"');
    expect(html).toContain('配音音色');
    expect(html).toContain('name="voice"');
  });
});
