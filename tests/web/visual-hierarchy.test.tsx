import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import HomePage from '../../apps/web/src/app/page';
import {
  getActionHierarchy,
  getHeadingHierarchy,
  spacingRatio
} from '../../apps/web/src/styles/visual-hierarchy';

describe('visual hierarchy system', () => {
  it('gives primary actions stronger visual weight than secondary actions', () => {
    expect(getActionHierarchy('primary').weight).toBeGreaterThan(getActionHierarchy('secondary').weight);
    expect(getActionHierarchy('primary').prominence).toBe('highest');
    expect(getActionHierarchy('secondary').prominence).toBe('medium');
  });

  it('defines consistent heading levels for product pages', () => {
    expect(getHeadingHierarchy('page').tag).toBe('h1');
    expect(getHeadingHierarchy('section').tag).toBe('h2');
    expect(getHeadingHierarchy('card').tag).toBe('h3');
  });

  it('keeps spacing ratios aligned to related/grouped/separated content', () => {
    expect(spacingRatio.related).toBe(1);
    expect(spacingRatio.grouped).toBe(1.5);
    expect(spacingRatio.separated).toBe(2);
  });
});

describe('ChatLandingPage visual hierarchy', () => {
  it('marks the page title and submit action as the primary focus', async () => {
    const html = renderToStaticMarkup(await HomePage());

    expect(html).toContain('data-visual-hierarchy="page-title"');
    expect(html).toContain('data-visual-hierarchy="primary-action"');
    expect(html).toContain('data-action-prominence="highest"');
    expect(html).toContain('<h1');
    expect(html).not.toContain('<h4');
  });
});
