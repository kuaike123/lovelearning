import {describe, expect, it} from 'vitest';

import * as sharedTypes from '../../packages/shared-types/src/index';

describe('workspace smoke test', () => {
  it('loads the shared-types package entrypoint', () => {
    expect(sharedTypes).toBeDefined();
  });
});
