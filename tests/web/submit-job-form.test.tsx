import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {SubmitJobForm} from '../../apps/web/src/app/SubmitJobForm';

describe('SubmitJobForm', () => {
  it('uses the streamlined TaskForm three-step structure', () => {
    const html = renderToStaticMarkup(
      <SubmitJobForm initialContent="Solve equation: 2x + 3 = 11" />
    );

    expect(html).toContain('Solve equation: 2x + 3 = 11');
    expect(html).toContain('data-task-form="three-step-flow"');
    expect((html.match(/data-task-form-step=/g) ?? []).length).toBe(3);
    expect(html).toContain('data-task-form-step="content"');
    expect(html).toContain('data-task-form-step="settings"');
    expect(html).toContain('data-task-form-step="review"');
    expect(html).toContain('data-form-preview="live-summary"');
  });

  it('removes the deprecated preflight and voice preview sections', () => {
    const html = renderToStaticMarkup(
      <SubmitJobForm initialContent="Solve equation: 2x + 3 = 11" />
    );

    expect(html).not.toContain('data-form-section="preflight-check"');
    expect(html).not.toContain('data-form-section="voice-preview"');
    expect(html).not.toContain('data-form-rail="creation-steps"');
    expect(html).not.toContain('data-sketch-form="new-video-draft"');
    expect(html).not.toContain('data-form-shell="professional-workflow"');
  });

  it('accepts legacy sample props without reintroducing old form complexity', () => {
    const taskName = '初一方程标准讲解';
    const html = renderToStaticMarkup(
      <SubmitJobForm
        initialContent="Solve equation: 2x + 3 = 11"
        initialStyle="exam"
        initialTargetDurationSec={60}
        initialTaskName={taskName}
        initialVoice="female_clear"
        initialSpeechRate="fast"
      />
    );

    expect(html).toContain(taskName);
    expect(html).toContain('option value="60" selected=""');
    expect(html).toContain('data-task-form="three-step-flow"');
    expect((html.match(/data-task-form-step=/g) ?? []).length).toBe(3);
  });
});
