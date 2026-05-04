import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {JobAssetPreview} from '../../apps/web/src/app/jobs/[id]/JobResultPanel';
import {Skeleton} from '../../apps/web/src/components/Skeleton';
import {
  estimateLayoutShift,
  meetsCoreWebVitals,
  reserveMediaSpace
} from '../../apps/web/src/styles/performance';

describe('image optimization', () => {
  it('uses an optimized image contract with explicit dimensions for cover previews', () => {
    const html = renderToStaticMarkup(
      <JobAssetPreview
        job={{
          jobId: 'job-1',
          status: 'completed',
          coverUrl: 'http://localhost:3001/artifacts/jobs/job-1/cover.png',
          videoUrl: 'http://localhost:3001/artifacts/jobs/job-1/output.mp4'
        }}
      />
    );

    expect(html).toContain('data-image-optimized="next-image"');
    expect(html).toContain('width="360"');
    expect(html).toContain('height="640"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('aspect-ratio:9 / 16');
  });
});

describe('Skeleton', () => {
  it('reserves final content dimensions during loading', () => {
    const html = renderToStaticMarkup(<Skeleton height={180} width="100%" />);

    expect(html).toContain('data-loading-state="skeleton"');
    expect(html).toContain('height:180px');
    expect(html).toContain('width:100%');
    expect(html).toContain('animation:skeleton-pulse 1200ms ease-in-out infinite');
  });
});

describe('performance utilities', () => {
  it('validates Core Web Vitals thresholds', () => {
    expect(meetsCoreWebVitals({cls: 0.08, fcpMs: 1200, lcpMs: 2200})).toBe(true);
    expect(meetsCoreWebVitals({cls: 0.12, fcpMs: 1200, lcpMs: 2200})).toBe(false);
  });

  it('reserves media space and keeps estimated layout shift below threshold', () => {
    const reserved = reserveMediaSpace({height: 640, width: 360});

    expect(reserved.aspectRatio).toBe('360 / 640');
    expect(estimateLayoutShift({finalHeight: 640, reservedHeight: 640, viewportHeight: 900})).toBeLessThan(0.1);
    expect(estimateLayoutShift({finalHeight: 640, reservedHeight: 0, viewportHeight: 900})).toBeGreaterThan(0.1);
  });
});
