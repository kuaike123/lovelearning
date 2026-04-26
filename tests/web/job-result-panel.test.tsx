import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import JobResultPage from '../../apps/web/src/app/jobs/[id]/page';
import {
  JobResultActions,
  JobAssetList,
  JobStatusSummary,
  LessonPlanSummary
} from '../../apps/web/src/app/jobs/[id]/JobResultPanel';

describe('JobResultPage', () => {
  it('uses a Chinese page title', () => {
    const html = renderToStaticMarkup(<JobResultPage params={{id: 'job-1'}} />);

    expect(html).toContain('\u751f\u6210\u7ed3\u679c');
    expect(html).not.toContain('Generation Result');
  });
});

describe('JobResultActions', () => {
  it('renders navigation and regenerate controls for the current job', () => {
    const html = renderToStaticMarkup(
      <JobResultActions jobId="job-1" onRegenerate={() => undefined} />
    );

    expect(html).toContain('href="/"');
    expect(html).toContain('\u8fd4\u56de\u9996\u9875');
    expect(html).toContain('\u91cd\u65b0\u751f\u6210');
  });
});

describe('JobAssetList', () => {
  it('renders generated asset links for a completed job', () => {
    const html = renderToStaticMarkup(
      <JobAssetList
        job={{
          jobId: 'job-1',
          status: 'completed',
          videoUrl: 'http://localhost:3001/artifacts/jobs/job-1/output.mp4',
          coverUrl: 'http://localhost:3001/artifacts/jobs/job-1/cover.png',
          subtitleUrl: 'http://localhost:3001/artifacts/jobs/job-1/subtitles.srt',
          lessonPlanUrl: 'http://localhost:3001/artifacts/jobs/job-1/lesson.json'
        }}
      />
    );

    expect(html).toContain('http://localhost:3001/artifacts/jobs/job-1/output.mp4');
    expect(html).toContain('http://localhost:3001/artifacts/jobs/job-1/subtitles.srt');
  });

  it('renders a playable preview and cover image for a completed job', () => {
    const html = renderToStaticMarkup(
      <JobAssetList
        job={{
          jobId: 'job-1',
          status: 'completed',
          videoUrl: 'http://localhost:3001/artifacts/jobs/job-1/output.mp4',
          coverUrl: 'http://localhost:3001/artifacts/jobs/job-1/cover.png'
        }}
      />
    );

    expect(html).toContain('<video');
    expect(html).toContain('controls=""');
    expect(html).toContain('poster="http://localhost:3001/artifacts/jobs/job-1/cover.png"');
    expect(html).toContain('<img');
    expect(html).toContain('alt="\u751f\u6210\u7684\u8bb2\u89e3\u89c6\u9891\u5c01\u9762"');
  });
});

describe('JobStatusSummary', () => {
  it('renders running status and current stage in Chinese', () => {
    const html = renderToStaticMarkup(
      <JobStatusSummary job={{status: 'running', stage: 'render', progress: 42}} />
    );

    expect(html).toContain('\u72b6\u6001\uff1a\u751f\u6210\u4e2d');
    expect(html).toContain('\u9636\u6bb5\uff1a\u6e32\u67d3\u89c6\u9891');
    expect(html).toContain('\u8fdb\u5ea6\uff1a42%');
    expect(html).toContain('aria-valuenow="42"');
  });
});

describe('JobResultPanel copy helpers', () => {
  it('shows custom task names and translates legacy parser errors', () => {
    const html = renderToStaticMarkup(
      <JobStatusSummary
        job={{
          status: 'failed',
          stage: 'parse',
          error: 'Unsupported input for V1 linear equation parser',
          taskName: '\u521d\u4e00\u65b9\u7a0b\u4f8b\u9898\u8bb2\u89e3'
        }}
      />
    );

    expect(html).toContain('\u4efb\u52a1\u540d\u79f0\uff1a\u521d\u4e00\u65b9\u7a0b\u4f8b\u9898\u8bb2\u89e3');
    expect(html).toContain('\u5f53\u524d\u7248\u672c\u4ec5\u652f\u6301\u4e00\u5143\u4e00\u6b21\u65b9\u7a0b\u89e3\u6790');
    expect(html).not.toContain('Unsupported input');
  });
});

describe('LessonPlanSummary', () => {
  it('renders lesson title, learning goal, steps, and summary with Chinese labels', () => {
    const html = renderToStaticMarkup(
      <LessonPlanSummary
        lessonPlan={{
          title: 'Solve 2x + 3 = 11',
          learningGoal: 'Solve a one-variable linear equation',
          summary: 'The final answer is x = 4.',
          steps: [
            {
              id: 'subtract-constant',
              teachingGoal: 'Remove the constant term',
              narration: 'First subtract 3 from both sides.',
              visualIntent: 'Show subtraction on both sides',
              keyText: ['2x = 8']
            },
            {
              id: 'state-answer',
              teachingGoal: 'State the final answer',
              narration: 'The answer is x = 4.',
              visualIntent: 'Highlight the answer',
              keyText: ['x = 4']
            }
          ]
        }}
      />
    );

    expect(html).toContain('\u8bb2\u89e3\u5927\u7eb2');
    expect(html).toContain('Solve 2x + 3 = 11');
    expect(html).toContain('\u5b66\u4e60\u76ee\u6807\uff1aSolve a one-variable linear equation');
    expect(html).toContain('First subtract 3 from both sides.');
    expect(html).toContain('x = 4');
  });
});
