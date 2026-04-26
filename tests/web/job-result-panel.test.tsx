import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {
  JobAssetList,
  JobStatusSummary,
  LessonPlanSummary
} from '../../apps/web/src/app/jobs/[id]/JobResultPanel';

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
    expect(html).toContain('alt="生成的讲解视频封面"');
  });
});

describe('JobStatusSummary', () => {
  it('renders running status and current stage in Chinese', () => {
    const html = renderToStaticMarkup(
      <JobStatusSummary job={{status: 'running', stage: 'render', progress: 42}} />
    );

    expect(html).toContain('状态：生成中');
    expect(html).toContain('阶段：渲染视频');
    expect(html).toContain('进度：42%');
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
          taskName: '初一方程例题讲解'
        }}
      />
    );

    expect(html).toContain('任务名称：初一方程例题讲解');
    expect(html).toContain('当前版本仅支持一元一次方程解析');
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

    expect(html).toContain('讲解大纲');
    expect(html).toContain('Solve 2x + 3 = 11');
    expect(html).toContain('学习目标：Solve a one-variable linear equation');
    expect(html).toContain('First subtract 3 from both sides.');
    expect(html).toContain('x = 4');
  });
});
