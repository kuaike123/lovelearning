import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import JobResultPage from '../../apps/web/src/app/jobs/[id]/page';
import {
  JobAssetPreview,
  JobResultActions,
  JobAssetList,
  JobStatusSummary,
  LessonPlanSummary
} from '../../apps/web/src/app/jobs/[id]/JobResultPanel';

describe('JobResultPage', () => {
  it('uses a Chinese page title', async () => {
    const html = renderToStaticMarkup(await JobResultPage({params: Promise.resolve({id: 'job-1'})}));

    expect(html).toContain('\u751f\u6210\u7ed3\u679c');
    expect(html).not.toContain('Generation Result');
  });
});

describe('JobResultPanel product copy', () => {
  it('renders a productized overview section for the current task', () => {
    const html = renderToStaticMarkup(
      <JobStatusSummary
        job={{
          status: 'running',
          stage: 'render',
          progress: 42,
          taskName: '\u521d\u4e00\u65b9\u7a0b\u6807\u51c6\u8bb2\u89e3',
          narrationTone: '\u9f13\u52b1\u542f\u53d1',
          coverTone: '\u50cf\u8001\u5e08\u5728\u8eab\u8fb9\u5e26\u7740\u5b66',
          voice: 'female_warm',
          speechRate: 'slow'
        }}
      />
    );

    expect(html).toContain('\u4efb\u52a1\u6982\u89c8');
    expect(html).toContain('\u5f53\u524d\u751f\u6210\u9636\u6bb5');
    expect(html).toContain('\u9884\u8ba1\u7ed3\u679c');
    expect(html).toContain('\u6e29\u67d4\u5973\u58f0');
    expect(html).toContain('\u6162\u901f');
    expect(html).toContain('\u9f13\u52b1\u542f\u53d1');
    expect(html).toContain('\u50cf\u8001\u5e08\u5728\u8eab\u8fb9\u5e26\u7740\u5b66');
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
          audioUrls: ['http://localhost:3001/artifacts/jobs/job-1/audio/s1.wav'],
          subtitleUrl: 'http://localhost:3001/artifacts/jobs/job-1/subtitles.srt',
          lessonPlanUrl: 'http://localhost:3001/artifacts/jobs/job-1/lesson.json'
        }}
      />
    );

    expect(html).toContain('http://localhost:3001/artifacts/jobs/job-1/output.mp4');
    expect(html).toContain('http://localhost:3001/artifacts/jobs/job-1/audio/s1.wav');
    expect(html).toContain('http://localhost:3001/artifacts/jobs/job-1/subtitles.srt');
    expect(html).toContain('data-result-section="delivery-assets"');
    expect(html).toContain('\u4ea4\u4ed8\u6e05\u5355');
    expect(html).toContain('\u53ef\u76f4\u63a5\u7528\u4e8e');
    expect(html).toContain('\u6210\u7247\u5b9a\u4f4d');
    expect(html).toContain('\u7ad6\u5c4f\u8bb2\u89e3\u89c6\u9891');
  });

  it('renders a playable preview and cover image for a completed job', () => {
    const html = renderToStaticMarkup(
      <JobAssetPreview
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
    expect(html).toContain('\u6210\u7247\u9884\u89c8');
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

    expect(html).toContain('data-result-section="lesson-outline"');
    expect(html).toContain('\u8bb2\u89e3\u5927\u7eb2');
    expect(html).toContain('Solve 2x + 3 = 11');
    expect(html).toContain('\u5b66\u4e60\u76ee\u6807\uff1aSolve a one-variable linear equation');
    expect(html).toContain('First subtract 3 from both sides.');
    expect(html).toContain('x = 4');
  });
});

describe('JobResultPanel information architecture', () => {
  it('puts result summary before delivery assets and lesson outline', () => {
    const html = renderToStaticMarkup(
      <JobStatusSummary
        job={{
          status: 'completed',
          stage: 'done',
          progress: 100,
          taskName: '\u521d\u4e00\u65b9\u7a0b\u6807\u51c6\u8bb2\u89e3',
          narrationTone: '\u6e05\u6670\u8bb2\u9898',
          coverTone: '\u6807\u51c6\u9898\u89e3\u6a21\u677f',
          voice: 'female_warm',
          speechRate: 'normal'
        }}
      />
    );

    expect(html).toContain('data-result-section="result-overview"');
    expect(html).toContain('\u5f53\u524d\u751f\u6210\u9636\u6bb5');
    expect(html).toContain('\u9884\u8ba1\u7ed3\u679c');
  });
});
