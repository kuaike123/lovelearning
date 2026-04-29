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

    expect(markup).toContain('\u6570\u5b66\u8bb2\u89e3\u89c6\u9891\u751f\u6210\u5668');
    expect(markup).toContain('Solve equation: 2x + 3 = 11');
  });
});
