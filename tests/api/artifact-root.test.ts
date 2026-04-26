import {resolve} from 'node:path';
import {describe, expect, it} from 'vitest';

import {getArtifactRoot} from '../../apps/api/src/artifacts/artifact-root';

describe('getArtifactRoot', () => {
  it('uses the workspace artifacts directory from the repo root cwd', () => {
    expect(getArtifactRoot(process.cwd())).toBe(resolve(process.cwd(), 'artifacts'));
  });

  it('uses the workspace artifacts directory from the api package cwd', () => {
    const apiPackageCwd = resolve(process.cwd(), 'apps', 'api');

    expect(getArtifactRoot(apiPackageCwd)).toBe(resolve(process.cwd(), 'artifacts'));
  });
});
