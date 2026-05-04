import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {Input} from '../../apps/web/src/components/Input';
import {designTokens} from '../../apps/web/src/styles/tokens';

describe('Input', () => {
  it('associates label and input with for/id attributes', () => {
    const html = renderToStaticMarkup(
      <Input id="task-name" label="任务名称" name="taskName" />
    );

    expect(html).toContain('<label');
    expect(html).toContain('for="task-name"');
    expect(html).toContain('id="task-name"');
    expect(html).toContain('name="taskName"');
  });

  it('renders contextual help text with an accessible description', () => {
    const html = renderToStaticMarkup(
      <Input id="problem" label="题目内容" helpText="请输入一道完整题目" />
    );

    expect(html).toContain('请输入一道完整题目');
    expect(html).toContain('data-input-help="true"');
    expect(html).toContain('aria-describedby="problem-help"');
    expect(html).toContain('id="problem-help"');
  });

  it('renders inline error messages and invalid state', () => {
    const html = renderToStaticMarkup(
      <Input id="content" label="题目内容" error="题目内容不能为空" />
    );

    expect(html).toContain('题目内容不能为空');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('role="alert"');
    expect(html).toContain('id="content-error"');
    expect(html).toContain(`border:1px solid ${designTokens.colors.danger}`);
  });

  it('uses token styles and remains keyboard focusable by default', () => {
    const html = renderToStaticMarkup(<Input id="grade" label="年级" />);

    expect(html).toContain(`border-radius:${designTokens.radii.md}`);
    expect(html).toContain('min-height:44px');
    expect(html).not.toContain('tabindex="-1"');
  });
});
