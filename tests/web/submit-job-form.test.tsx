import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {describe, expect, it} from 'vitest';

import {SubmitJobForm} from '../../apps/web/src/app/SubmitJobForm';

describe('SubmitJobForm', () => {
  it('renders the query-provided problem text with readable Chinese copy', () => {
    const html = renderToStaticMarkup(
      <SubmitJobForm initialContent="Solve equation: 2x + 3 = 11" />
    );

    expect(html).toContain('Solve equation: 2x + 3 = 11');
    expect(html).toContain('data-form-section="problem-input"');
    expect(html).toContain('data-form-section="generation-settings"');
    expect(html).toContain('data-form-section="voice-preview"');
    expect(html).toContain('data-form-section="workspace-overview"');
    expect(html).toContain('data-form-section="preflight-check"');
    expect(html).toContain('data-sketch-form="new-video-draft"');
    expect(html).toContain('data-form-shell="professional-workflow"');
    expect(html).toContain('data-form-visual-system="clean-saas"');
    expect(html).toContain('data-form-typography="product-editorial"');
    expect(html).toContain('data-form-workspace="content-with-preview"');
    expect(html).toContain('data-form-rail="creation-steps"');
    expect(html).toContain('data-form-editing-canvas="lesson-draft"');
    expect(html).toContain('data-form-stepper="generation-flow"');
    expect(html).toContain('data-form-preview="live-summary"');
    expect(html).toContain('CREATION FLOW');
    expect(html).toContain('\u6309\u6b65\u9aa4\u5b8c\u6210\u4e00\u6761\u8bb2\u89e3\u89c6\u9891');
    expect(html).toContain('\u5f53\u524d\u5df2\u5b8c\u6210');
    expect(html).toContain('grid-template-columns:minmax(190px, 230px) minmax(0, 1fr) minmax(260px, 340px)');
    expect(html).toContain('data-step-progress="form-completion"');
    expect(html).toContain('data-step-anchor="content"');
    expect(html).toContain('data-step-anchor="settings"');
    expect(html).toContain('data-step-anchor="voice"');
    expect(html).toContain('data-step-anchor="review"');
    expect(html).toContain('href="#problem-input"');
    expect(html).toContain('href="#generation-settings"');
    expect(html).toContain('href="#voice-preview"');
    expect(html).toContain('href="#preflight-check"');
    expect(html).toContain('id="problem-input"');
    expect(html).toContain('id="generation-settings"');
    expect(html).toContain('id="voice-preview"');
    expect(html).toContain('id="preflight-check"');
    expect(html).toContain('data-form-feedback="operation-status"');
    expect(html).toContain('data-card-variant="overview-clean"');
    expect(html).toContain('data-card-variant="section-clean"');
    expect(html).toContain('data-card-variant="recommendation-clean"');
    expect(html).toContain('data-card-variant="preflight-clean"');
    expect(html).toContain('data-loading-button="preview-audio"');
    expect(html).toContain('data-loading-button="generate-video"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('aria-busy="false"');
    expect(html).toContain('@media (max-width: 960px)');
    expect(html).toContain('[data-form-rail="creation-steps"]');
    expect(html).toContain('\u8f93\u5165\u9898\u76ee');
    expect(html).toContain('\u914d\u97f3\u9009\u62e9');
    expect(html).toContain('\u786e\u8ba4\u751f\u6210');
    expect(html).toContain('\u5b9e\u65f6\u9884\u89c8');
    expect(html).toContain('\u4ecd\u9700\u786e\u8ba4');
    expect(html).toContain('QUESTION / \u8f93\u5165\u9898\u76ee');
    expect(html).toContain('CONFIG / \u751f\u6210\u53c2\u6570');
    expect(html).toContain('VOICE / \u8bd5\u542c\u914d\u97f3');
    expect(html).toContain('CHECKLIST / \u6e32\u67d3\u524d\u68c0\u67e5');
    expect(html).toContain('\u9898\u76ee\u8f93\u5165');
    expect(html).toContain('\u751f\u6210\u8bbe\u7f6e');
    expect(html).toContain('\u8bd5\u542c\u4e0e\u914d\u97f3\u9009\u62e9');
    expect(html).toContain('\u521b\u4f5c\u603b\u89c8');
    expect(html).toContain('CHECKLIST / \u6e32\u67d3\u524d\u68c0\u67e5');
    expect(html).toContain('\u4efb\u52a1\u540d\u79f0');
    expect(html).toContain('\u751f\u6210\u89c6\u9891');
    expect(html).toContain('\u5bf9\u6bd4\u4e09\u79cd\u97f3\u8272');
    expect(html).toContain('\u63a8\u8350\u914d\u97f3');
    expect(html).toContain('\u63a8\u8350\u8bed\u901f');
    expect(html).toContain('\u8bb2\u89e3\u8bed\u6c14');
    expect(html).toContain('2/3 \u5df2\u5b8c\u6210');
    expect(html).toContain('\u51c6\u5907\u5c31\u7eea\uff0c\u586b\u5199\u9898\u76ee\u540e\u53ef\u4ee5\u8bd5\u542c\u97f3\u8272\u6216\u751f\u6210\u89c6\u9891\u3002');
  });

  it('renders generation option controls for teacher-facing requests', () => {
    const html = renderToStaticMarkup(
      <SubmitJobForm initialContent="Solve equation: 2x + 3 = 11" />
    );

    expect(html).toContain('\u9002\u7528\u5e74\u7ea7');
    expect(html).toContain('name="grade"');
    expect(html).toContain('\u76ee\u6807\u65f6\u957f');
    expect(html).toContain('name="targetDurationSec"');
    expect(html).toContain('\u8bb2\u89e3\u98ce\u683c');
    expect(html).toContain('name="style"');
    expect(html).toContain('\u914d\u97f3\u97f3\u8272');
    expect(html).toContain('name="voice"');
    expect(html).toContain('\u914d\u97f3\u8bed\u901f');
    expect(html).toContain('name="speechRate"');
    expect(html).toContain('type="button"');
    expect(html).toContain('\u5bf9\u6bd4\u4e09\u79cd\u97f3\u8272');
    expect(html).toContain('\u4e00\u952e\u91c7\u7528\u63a8\u8350\u97f3\u8272');
    expect(html).toContain('\u63a8\u8350\u8bed\u901f');
    expect(html).toContain('\u8bb2\u89e3\u8bed\u6c14');
    expect(html).toContain('\u53ef\u76f4\u63a5\u4ea4\u4ed8');
    expect(html).toContain('\u9ed8\u8ba4\u4ea7\u51fa');
  });

  it('accepts prefilled sample metadata for a fixed showcase flow', () => {
    const taskName = '\u521d\u4e00\u65b9\u7a0b\u6807\u51c6\u8bb2\u89e3';
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

    expect(
      html.includes(`value="${taskName}"`) ||
        html.includes('value="\\u521d\\u4e00\\u65b9\\u7a0b\\u6807\\u51c6\\u8bb2\\u89e3"')
    ).toBe(true);
    expect(html).toContain('option value="60" selected=""');
    expect(html).toContain('option value="exam" selected=""');
    expect(html).toContain('option value="female_clear" selected=""');
    expect(html).toContain('option value="fast" selected=""');
    expect(html).toContain('\u586b\u5199\u5b8c\u6574\uff0c\u53ef\u4ee5\u751f\u6210');
    expect(html).toContain('3/3 \u5df2\u5b8c\u6210');
  });
});
