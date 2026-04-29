import {describe, expect, it} from 'vitest';

import {getPublicApiBaseUrl, getPublicArtifactBaseUrl} from '../../apps/api/src/runtime-config';

describe('api runtime config', () => {
  it('uses the configured public api base url when present', () => {
    const runtimeEnv = {
      EDU_PUBLIC_BASE_URL: 'https://video.example.com/'
    };

    expect(getPublicApiBaseUrl(runtimeEnv)).toBe('https://video.example.com');
    expect(getPublicArtifactBaseUrl('jobs', 'job-1', 'output.mp4', runtimeEnv)).toBe(
      'https://video.example.com/artifacts/jobs/job-1/output.mp4'
    );
  });

  it('falls back to the configured server port for local development', () => {
    const runtimeEnv = {
      PORT: '4010'
    };

    expect(getPublicApiBaseUrl(runtimeEnv)).toBe('http://localhost:4010');
    expect(getPublicArtifactBaseUrl('previews', runtimeEnv)).toBe(
      'http://localhost:4010/artifacts/previews'
    );
  });
});
