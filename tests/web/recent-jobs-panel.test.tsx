import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {RecentJobsList} from '../../apps/web/src/app/RecentJobsPanel';

describe('RecentJobsList', () => {
  it('renders links to recent job result pages', () => {
    const html = renderToStaticMarkup(
      <RecentJobsList
        jobs={[
          {
            jobId: 'job-2',
            status: 'completed',
            createdAt: '2026-04-25T09:00:00.000Z',
            taskName: '初一方程例题讲解',
            problemText: '解方程：2x + 3 = 11'
          },
          {
            jobId: 'job-1',
            status: 'queued',
            createdAt: '2026-04-25T08:00:00.000Z',
            problemText: '解方程：x + 1 = 2'
          }
        ]}
      />
    );

    expect(html).toContain('最近任务');
    expect(html).toContain('/jobs/job-2');
    expect(html).toContain('初一方程例题讲解');
    expect(html).toContain('解方程：2x + 3 = 11');
    expect(html).toContain('已完成');
  });

  it('renders an empty state when no jobs exist yet', () => {
    const html = renderToStaticMarkup(<RecentJobsList jobs={[]} />);

    expect(html).toContain('还没有生成记录');
  });
});
