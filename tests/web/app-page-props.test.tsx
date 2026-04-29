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
    expect(markup).toContain('\u4e2d\u5c0f\u5b66\u6559\u57f9\u89c6\u9891\u5de5\u5382');
    expect(markup).toContain('\u4ece\u9898\u76ee\u5230\u77ed\u89c6\u9891');
    expect(markup).toContain('data-home-entry="create"');
    expect(markup).toContain('data-home-entry="samples"');
    expect(markup).toContain('data-home-entry="jobs"');
    expect(markup).toContain('data-home-panel="create"');
    expect(markup).toContain('data-home-illustration="create"');
    expect(markup).toContain('data-home-motion="panel-hero"');
    expect(markup).toContain('\u65b0\u5efa\u89c6\u9891');
    expect(markup).toContain('\u6d4f\u89c8\u6837\u7247');
    expect(markup).toContain('\u67e5\u770b\u8fdb\u5ea6');
  });
});
