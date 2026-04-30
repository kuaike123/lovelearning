import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {filterRecentJobs, RecentJobsList} from '../../apps/web/src/app/RecentJobsPanel';

const taskName = '\u521d\u4e00\u65b9\u7a0b\u4f8b\u9898\u8bb2\u89e3';
const equationProblem = '\u89e3\u65b9\u7a0b\uff1a2x + 3 = 11';
const queuedProblem = '\u89e3\u65b9\u7a0b\uff1ax + 1 = 2';

describe('RecentJobsList', () => {
  it('renders links to recent job result pages', () => {
    const html = renderToStaticMarkup(
      <RecentJobsList
        jobs={[
          {
            jobId: 'job-2',
            status: 'completed',
            stage: 'done',
            progress: 100,
            createdAt: '2026-04-25T09:00:00.000Z',
            taskName,
            problemText: equationProblem
          },
          {
            jobId: 'job-1',
            status: 'running',
            stage: 'render',
            progress: 42,
            createdAt: '2026-04-25T08:00:00.000Z',
            problemText: queuedProblem
          }
        ]}
      />
    );

    expect(html).toContain('/jobs/job-2');
    expect(html).toContain(taskName);
    expect(html).toContain(equationProblem);
    expect(html).toContain('\u5df2\u5b8c\u6210');
    expect(html).toContain('\u4efb\u52a1\u603b\u89c8');
    expect(html).toContain('\u6b63\u5728\u751f\u6210');
    expect(html).toContain('\u5f53\u524d\u9636\u6bb5');
    expect(html).toContain('\u6e32\u67d3\u89c6\u9891');
    expect(html).toContain('\u8fdb\u5ea6 42%');
  }, 30000);

  it('renders an empty state when no jobs exist yet', () => {
    const html = renderToStaticMarkup(<RecentJobsList jobs={[]} />);

    expect(html).toContain('\u8fd8\u6ca1\u6709\u751f\u6210\u8bb0\u5f55');
  });

  it('renders failed reasons and management controls for manageable jobs', () => {
    const html = renderToStaticMarkup(
      <RecentJobsList
        jobs={[
          {
            error: '\u5f53\u524d\u7248\u672c\u4ec5\u652f\u6301\u4e00\u5143\u4e00\u6b21\u65b9\u7a0b\u89e3\u6790',
            jobId: 'job-failed',
            status: 'failed',
            stage: 'parse',
            taskName: '\u5931\u8d25\u4efb\u52a1',
            problemText: '\u89e3\u65b9\u7a0b\uff1a2x +'
          }
        ]}
        onDelete={() => undefined}
        onRegenerate={() => undefined}
      />
    );

    expect(html).toContain('\u5931\u8d25\u539f\u56e0');
    expect(html).toContain('\u9700\u8981\u5904\u7406');
    expect(html).toContain('\u8bf7\u4f18\u5148\u68c0\u67e5\u5931\u8d25\u4efb\u52a1');
    expect(html).toContain('\u5220\u9664\u4efb\u52a1');
    expect(html).toContain('\u91cd\u65b0\u751f\u6210');
  });

  it('filters recent jobs by task name or problem text', () => {
    const jobs = [
      {jobId: 'job-1', status: 'completed', taskName, problemText: equationProblem},
      {jobId: 'job-2', status: 'completed', taskName: '\u51e0\u4f55\u4f8b\u9898', problemText: '\u4e09\u89d2\u5f62'}
    ];

    expect(filterRecentJobs(jobs, '\u65b9\u7a0b')).toEqual([jobs[0]]);
    expect(filterRecentJobs(jobs, '2x')).toEqual([jobs[0]]);
    expect(filterRecentJobs(jobs, '')).toEqual(jobs);
  });
});
