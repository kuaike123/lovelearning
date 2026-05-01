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
  });

  it('renders the home page when searchParams are provided as a promise', async () => {
    const markup = renderToStaticMarkup(
      await HomePage({
        searchParams: Promise.resolve({content: 'Solve equation: 2x + 3 = 11'})
      } as never)
    );

    expect(markup).toContain('Solve equation: 2x + 3 = 11');
    expect(markup).toContain('data-home-layout="workspace"');
    expect(markup).toContain('\u4e2d\u56fd\u6559\u57f9\u56e2\u961f\u7684 AI \u8bb2\u89e3\u89c6\u9891\u5de5\u4f5c\u53f0');
    expect(markup).toContain('\u628a\u4e00\u9053\u9898\uff0c\u505a\u6210\u4e00\u6761\u4f1a\u8bb2\u8bfe\u7684\u77ed\u89c6\u9891');
    expect(markup).toContain('data-home-entry="create"');
    expect(markup).toContain('data-home-entry="samples"');
    expect(markup).toContain('data-home-entry="jobs"');
    expect(markup).toContain('data-home-panel="create"');
    expect(markup).toContain('data-home-illustration="create"');
    expect(markup).toContain('data-home-motion="panel-hero"');
    expect(markup).toContain('\u65b0\u5efa\u89c6\u9891');
    expect(markup).toContain('\u6d4f\u89c8\u6837\u7247');
    expect(markup).toContain('\u67e5\u770b\u8fdb\u5ea6');
    expect(markup).toContain('\u521b\u4f5c\u3001\u6837\u7247\u3001\u8fdb\u5ea6\u4e09\u4e2a\u5165\u53e3');
    expect(markup).toContain('\u5185\u5bb9\u6837\u7247\u6d41');
    expect(markup).toContain('data-sketch-portal="wireframe"');
    expect(markup).toContain('LoveLearning AI \u00b7 Portal');
    expect(markup).toContain('WIREFRAME V1');
    expect(markup).toContain('00 ALL');
    expect(markup).toContain('01');
    expect(markup).toContain('\u65b0\u5efa\u8bb2\u89e3');
    expect(markup).toContain('data-sketch-canvas="home-dashboard"');
    expect(markup).toContain('lovelearning.ai / portal / dashboard');
    expect(markup).toContain('\u4eca\u5929\u4f18\u5148\u505a\uff1a\u8ba9\u8001\u5e08\u4e00\u773c\u77e5\u9053\u4ece\u54ea\u91cc\u5f00\u59cb\u751f\u6210');
  });
});
