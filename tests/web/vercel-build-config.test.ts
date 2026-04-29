import {describe, expect, it} from 'vitest';

import rootPackageJson from '../../package.json';
import webPackageJson from '../../apps/web/package.json';

describe('vercel build config', () => {
  it('exposes a root vercel build script that delegates to the web app', () => {
    expect(rootPackageJson.scripts).toBeDefined();
    expect(rootPackageJson.scripts['vercel-build']).toBe('pnpm --filter web build');
  });

  it('exposes a standard build script in the web app package', () => {
    expect(webPackageJson.scripts).toBeDefined();
    expect(webPackageJson.scripts.build).toBe('next build');
  });
});
