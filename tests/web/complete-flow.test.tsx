import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import HomePage from '../../apps/web/src/app/page';
import RootLayout, {metadata, viewport as rootViewport} from '../../apps/web/src/app/layout';

describe('complete product flow integration', () => {
  it('renders the main creation flow and major navigation views in the same shell', async () => {
    const createHtml = renderToStaticMarkup(await HomePage());
    const jobsHtml = renderToStaticMarkup(
      await HomePage({searchParams: Promise.resolve({view: 'jobs'} as never)})
    );
    const samplesHtml = renderToStaticMarkup(
      await HomePage({searchParams: Promise.resolve({view: 'samples'} as never)})
    );

    expect(createHtml).toContain('data-layout="responsive-app"');
    expect(createHtml).toContain('data-chat-composer="problem-input"');
    expect(createHtml).toContain('data-chat-output-options="output-types"');
    expect(jobsHtml).toContain('data-chat-panel="jobs"');
    expect(samplesHtml).toContain('data-chat-panel="samples"');
    expect(samplesHtml).toContain('data-sample-gallery="responsive-grid"');
  });

  it('exports responsive viewport metadata for app router pages', () => {
    expect(rootViewport).toMatchObject({initialScale: 1, themeColor: '#F8FAFC', width: 'device-width'});
    expect(metadata.title).toBeTruthy();
  });

  it('wraps pages with a font optimization hook on the body', () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <main>内容</main>
      </RootLayout>
    );

    expect(html).toContain('data-font-optimized="next-font"');
  });
});
