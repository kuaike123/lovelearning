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
    expect(markup).toContain('\u751f\u6210\u5de5\u4f5c\u53f0');
    expect(markup).toContain('\u8fd1\u671f\u8fd0\u8425\u9762\u677f');
  });
});
