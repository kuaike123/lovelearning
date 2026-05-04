import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {FormPreview} from '../../apps/web/src/components/FormPreview';
import {TaskForm} from '../../apps/web/src/components/TaskForm';

describe('TaskForm', () => {
  it('renders a maximum three-step creation flow with advanced options collapsed', () => {
    const html = renderToStaticMarkup(<TaskForm />);

    expect((html.match(/data-task-form-step=/g) ?? []).length).toBe(3);
    expect(html).toContain('data-task-form-step="content"');
    expect(html).toContain('data-task-form-step="settings"');
    expect(html).toContain('data-task-form-step="review"');
    expect(html).toContain('data-task-form-advanced="collapsed"');
    expect(html).not.toContain('data-task-form-step="preflight"');
  });

  it('enables submit when required content is available and disables it when empty', () => {
    const emptyHtml = renderToStaticMarkup(<TaskForm />);
    const filledHtml = renderToStaticMarkup(<TaskForm initialContent="解方程：2x + 3 = 11" />);

    expect(emptyHtml).toContain('disabled=""');
    expect(filledHtml).not.toContain('disabled=""');
    expect(filledHtml).toContain('解方程：2x + 3 = 11');
  });

  it('exposes draft persistence and inline validation timing contracts', () => {
    const html = renderToStaticMarkup(<TaskForm />);

    expect(html).toContain('data-draft-interval-ms="30000"');
    expect(html).toContain('data-validation-feedback-ms="200"');
    expect(html).toContain('题目内容不能为空');
  });
});

describe('FormPreview', () => {
  it('renders a sticky live preview with current form values and toggle affordance', () => {
    const html = renderToStaticMarkup(
      <FormPreview
        content="解方程：2x + 3 = 11"
        outputType="讲解视频"
        subject="数学"
        targetDurationSec={45}
      />
    );

    expect(html).toContain('data-form-preview="live-summary"');
    expect(html).toContain('data-preview-update-ms="300"');
    expect(html).toContain('position:sticky');
    expect(html).toContain('解方程：2x + 3 = 11');
    expect(html).toContain('讲解视频');
    expect(html).toContain('45 秒');
    expect(html).toContain('隐藏预览');
  });
});
