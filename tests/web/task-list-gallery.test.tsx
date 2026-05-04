import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {SampleGallery} from '../../apps/web/src/components/SampleGallery';
import {TaskList} from '../../apps/web/src/components/TaskList';

const tasks = [
  {
    createdAt: '2026-05-04T08:00:00.000Z',
    href: '/jobs/1',
    id: '1',
    status: 'completed',
    thumbnailUrl: '/cover-1.png',
    title: '初一方程讲解'
  },
  {
    createdAt: '2026-05-04T09:00:00.000Z',
    href: '/jobs/2',
    id: '2',
    status: 'running',
    title: '应用题样片'
  }
];

const samples = [
  {
    durationSec: 45,
    href: '/?sampleStyle=linear',
    id: 'linear',
    style: '标准讲解',
    subject: '数学',
    title: '一元一次方程',
    voice: '温柔女声'
  },
  {
    durationSec: 60,
    href: '/?sampleStyle=word',
    id: 'word',
    style: '提分讲解',
    subject: '数学',
    title: '数量关系应用题',
    voice: '清晰女声'
  }
];

describe('TaskList', () => {
  it('renders consistent task cards with status badges and thumbnails', () => {
    const html = renderToStaticMarkup(<TaskList tasks={tasks} />);

    expect(html).toContain('data-task-list="grid"');
    expect(html).toContain('data-task-card="1"');
    expect(html).toContain('data-status="completed"');
    expect(html).toContain('已完成');
    expect(html).toContain('data-thumbnail-state="loaded"');
    expect(html).toContain('aspect-ratio:16 / 9');
  });

  it('sorts and highlights matching search text', () => {
    const html = renderToStaticMarkup(<TaskList search="应用题" sortBy="createdAt" tasks={tasks} />);

    expect(html.indexOf('应用题样片')).toBeLessThan(html.indexOf('初一方程讲解'));
    expect(html).toContain('<mark>应用题</mark>');
  });
});

describe('SampleGallery', () => {
  it('renders a responsive gallery with active filters and consistent metadata', () => {
    const html = renderToStaticMarkup(
      <SampleGallery activeSubject="数学" samples={samples} />
    );

    expect(html).toContain('data-sample-gallery="responsive-grid"');
    expect(html).toContain('data-filter-update-ms="200"');
    expect(html).toContain('data-active-filter="数学"');
    expect(html).toContain('45 秒');
    expect(html).toContain('温柔女声');
    expect(html).toContain('grid-template-columns:repeat(auto-fit');
  });

  it('renders keyboard and preview affordances for every sample', () => {
    const html = renderToStaticMarkup(<SampleGallery samples={samples} />);

    expect(html).toContain('tabindex="0"');
    expect(html).toContain('data-keyboard-navigation="arrow-enter"');
    expect(html).toContain('data-sample-preview="side-panel"');
    expect(html).toContain('预览');
  });
});
