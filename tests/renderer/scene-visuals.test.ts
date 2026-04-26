import {describe, expect, it} from 'vitest';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

import {EquationTransformScene} from '../../packages/renderer/src/scenes/EquationTransformScene';
import {FormulaBoard} from '../../packages/renderer/src/components/FormulaBoard';
import {formatSceneType} from '../../packages/renderer/src/compositions/LessonVideo';
import {getSceneVisuals} from '../../packages/renderer/src/lib/scene-visuals';
import {MistakeWarningScene} from '../../packages/renderer/src/scenes/MistakeWarningScene';
import {ProblemScene} from '../../packages/renderer/src/scenes/ProblemScene';
import {SceneProgress} from '../../packages/renderer/src/components/SceneProgress';
import {getSceneRenderer} from '../../packages/renderer/src/lib/scene-renderer-registry';
import {ShortVideoShell} from '../../packages/renderer/src/components/ShortVideoShell';
import {SummaryScene} from '../../packages/renderer/src/scenes/SummaryScene';
import {TitleScene} from '../../packages/renderer/src/scenes/TitleScene';

describe('getSceneVisuals', () => {
  it('extracts formula chips and teaching copy from scene props', () => {
    const visuals = getSceneVisuals({
      id: 'simplify',
      sceneType: 'step',
      durationSec: 6,
      subtitle: 'The constant cancels on the left, and the right side becomes 8.',
      props: {
        teachingGoal: 'Simplify both sides',
        visualIntent: 'Cross out the constant pair and reveal the simplified equation',
        keyText: ['2x = 8', 'x = 4']
      }
    });

    expect(visuals.heading).toBe('Simplify both sides');
    expect(visuals.detail).toBe('Cross out the constant pair and reveal the simplified equation');
    expect(visuals.formulas).toEqual(['2x = 8', 'x = 4']);
  });

  it('falls back to subtitle text when no key text exists', () => {
    const visuals = getSceneVisuals({
      id: 'title',
      sceneType: 'title',
      durationSec: 3,
      subtitle: 'Solve 2x + 3 = 11',
      props: {}
    });

    expect(visuals.heading).toBe('Solve 2x + 3 = 11');
    expect(visuals.formulas).toEqual(['Solve 2x + 3 = 11']);
  });

  it('prefers structured visual instructions over legacy freeform props', () => {
    const visuals = getSceneVisuals({
      id: 'solve',
      sceneType: 'step',
      durationSec: 8,
      subtitle: 'Subtract 3 from both sides.',
      visualInstruction: {
        layout: 'formula_focus',
        primaryText: 'Move the constant away',
        detail: 'Both sides do the same operation.',
        formulaBlocks: ['2x + 3 = 11', '2x = 8'],
        highlights: ['-3'],
        motionPreset: 'transform'
      },
      props: {
        teachingGoal: 'Legacy heading',
        visualIntent: 'Legacy detail',
        keyText: ['legacy']
      }
    });

    expect(visuals.heading).toBe('Move the constant away');
    expect(visuals.detail).toBe('Both sides do the same operation.');
    expect(visuals.formulas).toEqual(['2x + 3 = 11', '2x = 8']);
    expect(visuals.motionPreset).toBe('transform');
  });

  it('selects a registered scene renderer by visual layout', () => {
    expect(getSceneRenderer('problem_card').label).toBe('\u9898\u76ee\u5361\u7247');
    expect(getSceneRenderer('formula_focus').label).toBe('\u516c\u5f0f\u805a\u7126');
    expect(getSceneRenderer('summary').label).toBe('\u603b\u7ed3\u6536\u675f');
  });

  it('uses Chinese fallback copy in standalone scenes', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(TitleScene),
        React.createElement(ProblemScene),
        React.createElement(EquationTransformScene),
        React.createElement(MistakeWarningScene),
        React.createElement(SummaryScene)
      )
    );

    expect(html).toContain('\u8bfe\u7a0b\u6807\u9898');
    expect(html).toContain('\u9898\u76ee\u5c55\u793a');
    expect(html).toContain('\u7b49\u5f0f\u53d8\u5f62');
    expect(html).toContain('\u6613\u9519\u63d0\u9192');
    expect(html).toContain('\u8bfe\u5802\u603b\u7ed3');
  });

  it('formats scene type labels in Chinese for video overlays', () => {
    expect(formatSceneType('title')).toBe('\u7247\u5934');
    expect(formatSceneType('problem')).toBe('\u8bfb\u9898');
    expect(formatSceneType('step')).toBe('\u8bb2\u89e3');
    expect(formatSceneType('warning')).toBe('\u6613\u9519\u63d0\u9192');
    expect(formatSceneType('summary')).toBe('\u603b\u7ed3');
  });

  it('renders formula board with primary and answer emphasis', () => {
    const html = renderToStaticMarkup(
      React.createElement(FormulaBoard, {
        formulas: ['x + 2x = 12', 'x = 4', '2x = 8'],
        sceneType: 'summary'
      })
    );

    expect(html).toContain('\u516c\u5f0f\u677f\u4e66');
    expect(html).toContain('\u6700\u7ec8\u7b54\u6848');
    expect(html).toContain('x + 2x = 12');
    expect(html).toContain('2x = 8');
  });

  it('renders a short-video shell with cover-style brand chrome', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        ShortVideoShell,
        {
          sceneType: 'title',
          sceneNumber: 1,
          title: '\u6570\u91cf\u5173\u7cfb\u5e94\u7528\u9898',
          totalScenes: 6
        },
        React.createElement('p', null, 'content')
      )
    );

    expect(html).toContain('\u77e5\u8bc6\u70b9\u901f\u8bb2');
    expect(html).toContain('1/6');
    expect(html).toContain('\u6570\u91cf\u5173\u7cfb\u5e94\u7528\u9898');
  });

  it('renders eased scene progress as a teaching rhythm bar', () => {
    const html = renderToStaticMarkup(React.createElement(SceneProgress, {progress: 0.42}));

    expect(html).toContain('aria-label="\u89c6\u9891\u8bb2\u89e3\u8fdb\u5ea6"');
    expect(html).toContain('42%');
  });
});
