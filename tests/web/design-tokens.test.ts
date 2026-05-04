import {readFileSync} from 'node:fs';
import {join} from 'node:path';

import {describe, expect, it} from 'vitest';

import {designTokens, tokenCssVariables, type DesignTokenCategory} from '../../apps/web/src/styles/tokens';

const cssPath = join(process.cwd(), 'apps/web/src/styles/tokens.css');
const css = readFileSync(cssPath, 'utf8');

describe('design tokens', () => {
  it('defines all required token categories for the unified UI system', () => {
    const categories: DesignTokenCategory[] = ['colors', 'spacing', 'typography', 'shadows', 'radii'];

    for (const category of categories) {
      expect(designTokens[category]).toBeDefined();
      expect(Object.keys(designTokens[category]).length).toBeGreaterThan(0);
    }
  });

  it('keeps TypeScript exports aligned with CSS custom properties', () => {
    expect(tokenCssVariables.colorPrimary).toBe('--ll-color-primary');
    expect(tokenCssVariables.spacing4).toBe('--ll-spacing-4');
    expect(tokenCssVariables.radiusMd).toBe('--ll-radius-md');

    expect(css).toContain(`${tokenCssVariables.colorPrimary}: ${designTokens.colors.primary};`);
    expect(css).toContain(`${tokenCssVariables.colorNeutral900}: ${designTokens.colors.neutral900};`);
    expect(css).toContain(`${tokenCssVariables.spacing4}: ${designTokens.spacing[4]};`);
    expect(css).toContain(`${tokenCssVariables.fontBody}: ${designTokens.typography.fontBody};`);
    expect(css).toContain(`${tokenCssVariables.shadowMedium}: ${designTokens.shadows.medium};`);
    expect(css).toContain(`${tokenCssVariables.radiusMd}: ${designTokens.radii.md};`);
  });
});
