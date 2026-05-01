import {describe, expect, it} from 'vitest';

import {
  appShellStyle,
  contentShellStyle,
  createButtonStyle,
  createCardStyle,
  createEyebrowStyle,
  createPillStyle,
  createSketchButtonStyle,
  createSketchCardStyle,
  createSketchEyebrowStyle,
  createSketchPageStyle,
  createSketchPillStyle,
  createSketchSectionStyle,
  sectionIntroStyle,
  formControlStyle,
  formFieldLabelStyle,
  optionGridStyle,
  textareaControlStyle,
  workspaceGridStyle
} from '../../apps/web/src/app/ui-primitives';

describe('web UI primitives', () => {
  it('exposes shared page, card, button, form, and section styles for product pages', () => {
    expect(appShellStyle.minHeight).toBe('100vh');
    expect(contentShellStyle.maxWidth).toBe(1280);
    expect(workspaceGridStyle.gridTemplateColumns).toContain('repeat(auto-fit');
    expect(sectionIntroStyle.display).toBe('grid');
    expect(createCardStyle().borderRadius).toBe(20);
    expect(createCardStyle({tone: 'elevated'}).boxShadow).toContain('rgba');
    expect(createButtonStyle({tone: 'primary'}).background).toBe('#102A43');
    expect(createButtonStyle({tone: 'secondary'}).border).toContain('#d7c8a9');
    expect(createEyebrowStyle().letterSpacing).toBe(1.4);
    expect(formFieldLabelStyle.fontWeight).toBe(700);
    expect(formControlStyle.borderRadius).toBe(14);
    expect(textareaControlStyle.minHeight).toBe(128);
    expect(optionGridStyle.gridTemplateColumns).toContain('repeat(auto-fit');
    expect(createPillStyle().borderRadius).toBe(999);
    expect(createPillStyle({tone: 'accent'}).background).toBe('#FFF4CC');
  });

  it('exposes shared sketch styles for the hand-drawn product interface', () => {
    expect(createSketchPageStyle().background).toContain('#f8efdc');
    expect(createSketchPageStyle().backgroundSize).toBe('22px 22px');
    expect(createSketchCardStyle().border).toBe('3px solid #2a241d');
    expect(createSketchSectionStyle().boxShadow).toBe('10px 10px 0 #2a241d');
    expect(createSketchSectionStyle().backgroundSize).toBe('22px 22px');
    expect(createSketchCardStyle({tone: 'paper'}).boxShadow).toBe('6px 6px 0 #2a241d');
    expect(createSketchCardStyle({tone: 'note'}).background).toBe('#fff096');
    expect(createSketchButtonStyle({tone: 'primary'}).background).toBe('#d9482e');
    expect(createSketchButtonStyle({tone: 'secondary'}).border).toBe('2px solid #2a241d');
    expect(createSketchEyebrowStyle().color).toBe('#d9482e');
    expect(createSketchPillStyle({tone: 'success'}).background).toBe('#eaf4d3');
  });
});
