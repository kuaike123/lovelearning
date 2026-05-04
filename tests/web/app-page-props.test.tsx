import {describe, expect, it} from 'vitest';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

import HomePage from '../../apps/web/src/app/page';
import JobResultPage from '../../apps/web/src/app/jobs/[id]/page';

describe('app router page props', () => {
  it('renders the job page when params are provided as a promise', async () => {
    const markup = renderToStaticMarkup(
      await JobResultPage({
        params: Promise.resolve({id: 'job-123'})
      } as never)
    );

    expect(markup).toContain('\u751f\u6210\u7ed3\u679c');
    expect(markup).toContain('job-123');
    expect(markup).toContain('data-job-typography="product-editorial"');
  });

  it('renders the home page when searchParams are provided as a promise', async () => {
    const markup = renderToStaticMarkup(
      await HomePage({
        searchParams: Promise.resolve({content: 'Solve equation: 2x + 3 = 11'})
      } as never)
    );

    expect(markup).toContain('Solve equation: 2x + 3 = 11');
    expect(markup).toContain('data-chat-shell="landing"');
    expect(markup).toContain('data-navigation="app-shell"');
    expect(markup).toContain('data-navigation-region="desktop-sidebar"');
    expect(markup).toContain('data-chat-composer="problem-input"');
    expect(markup).toContain('data-theme-toggle="mode-switch"');
    expect(markup).toContain('输入题目，生成讲解视频');
    expect(markup).toContain('开始生成');
    expect(markup).toContain('高级设置');
    expect(markup).not.toContain('data-saas-shell="home-workspace"');
    expect(markup).not.toContain('PRODUCT BETA');
  });

  it('resolves the home view from searchParams without leaving the chat shell', async () => {
    const markup = renderToStaticMarkup(
      await HomePage({
        searchParams: Promise.resolve({view: 'samples'} as never)
      } as never)
    );

    expect(markup).toContain('data-chat-shell="landing"');
    expect(markup).toContain('data-chat-panel="samples"');
    expect(markup).toContain('\u6837\u7247\u5e93');
    expect(markup).not.toContain('data-home-panel="samples"');
  });
});
