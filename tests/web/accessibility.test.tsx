import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import HomePage from '../../apps/web/src/app/page';
import {
  auditStaticAccessibility,
  contrastRatio,
  meetsWcagAaContrast
} from '../../apps/web/src/styles/accessibility';

describe('accessibility helpers', () => {
  it('validates WCAG AA contrast for design token color pairs', () => {
    expect(contrastRatio('#111827', '#FFFFFF')).toBeGreaterThan(10);
    expect(meetsWcagAaContrast('#111827', '#FFFFFF', 'normal')).toBe(true);
    expect(meetsWcagAaContrast('#4B5563', '#FFFFFF', 'normal')).toBe(true);
    expect(meetsWcagAaContrast('#F3F4F6', '#FFFFFF', 'normal')).toBe(false);
  });

  it('reports missing accessible labels in static markup', () => {
    const invalidMarkup = '<button></button><input id="name" />';
    const issues = auditStaticAccessibility(invalidMarkup);

    expect(issues).toContain('button-missing-accessible-name');
    expect(issues).toContain('input-missing-label');
  });
});

describe('HomePage accessibility', () => {
  it('has semantic labels, visible focus styles, and no static accessibility issues', async () => {
    const html = renderToStaticMarkup(await HomePage());
    const issues = auditStaticAccessibility(html);

    expect(html).toContain('aria-label="题目内容"');
    expect(html).toContain('aria-label="麦克风"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain(':focus-visible');
    expect(issues).toEqual([]);
  });
});
