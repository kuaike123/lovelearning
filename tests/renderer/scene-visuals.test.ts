import {describe, expect, it} from 'vitest';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

import {EquationTransformScene} from '../../packages/renderer/src/scenes/EquationTransformScene';
import {FormulaBoard} from '../../packages/renderer/src/components/FormulaBoard';
import {formatSceneType} from '../../packages/renderer/src/compositions/LessonVideo';
import {getPresenterStateForScene, PresenterMascot} from '../../packages/renderer/src/components/PresenterMascot';
import {getSceneVisuals} from '../../packages/renderer/src/lib/scene-visuals';
import {MistakeWarningScene} from '../../packages/renderer/src/scenes/MistakeWarningScene';
import {ProblemScene} from '../../packages/renderer/src/scenes/ProblemScene';
import {SceneProgress} from '../../packages/renderer/src/components/SceneProgress';
import {getSceneRenderer} from '../../packages/renderer/src/lib/scene-renderer-registry';
import {SceneLayoutRenderer} from '../../packages/renderer/src/components/SceneLayoutRenderer';
import {ShortVideoShell} from '../../packages/renderer/src/components/ShortVideoShell';
import {Subtitle} from '../../packages/renderer/src/components/Subtitle';
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

  it('renders title card scenes with a learning goal hero layout', () => {
    const html = renderToStaticMarkup(
      React.createElement(SceneLayoutRenderer, {
        sceneType: 'title',
        visuals: {
          heading: '\u4e00\u5143\u4e00\u6b21\u65b9\u7a0b',
          eyebrow: '\u8003\u70b9\u76f4\u5165',
          coverLayout: 'equation_focus',
          detail: '\u638c\u63e1\u79fb\u9879\u548c\u5316\u7b80',
          formulas: ['\u4e00\u5143\u4e00\u6b21\u65b9\u7a0b'],
          layout: 'title_card',
          layoutLabel: '\u5c01\u9762\u7247\u5934',
          narration: '\u4eca\u5929\u6765\u5b66\u4e00\u5143\u4e00\u6b21\u65b9\u7a0b'
        }
      })
    );

    expect(html).toContain('\u5b66\u4e60\u76ee\u6807');
    expect(html).toContain('\u8003\u70b9\u76f4\u5165');
    expect(html).toContain('\u638c\u63e1\u79fb\u9879\u548c\u5316\u7b80');
    expect(html).toContain('\u4e00\u5143\u4e00\u6b21\u65b9\u7a0b');
    expect(html).toContain('\u4eca\u65e5\u8bb2\u5e08\u63d0\u8981');
    expect(html).toContain('\u8001\u5e08\u53e3\u64ad\u5356\u70b9');
  });

  it('renders quantity-relation title cards with condition-style cover blocks', () => {
    const html = renderToStaticMarkup(
      React.createElement(SceneLayoutRenderer, {
        sceneType: 'title',
        visuals: {
          heading: '\u6570\u91cf\u5173\u7cfb\u5e94\u7528\u9898',
          eyebrow: '\u5df2\u77e5\u6761\u4ef6\u62c6\u5f00\u8bb2',
          coverLayout: 'quantity_story',
          detail: '\u5148\u62c6\u5df2\u77e5\u6761\u4ef6\uff0c\u518d\u5217\u51fa\u5173\u7cfb\u5f0f',
          formulas: ['\u548c = 12', '\u500d\u6570 = 2'],
          highlights: ['\u548c = 12', '\u500d\u6570 = 2'],
          layout: 'title_card',
          layoutLabel: '\u5c01\u9762\u7247\u5934',
          narration: '\u5148\u627e\u51fa\u9898\u76ee\u91cc\u7684\u548c\u500d\u6570'
        }
      })
    );

    expect(html).toContain('\u5df2\u77e5\u6761\u4ef6');
    expect(html).toContain('\u5173\u7cfb\u7ebf\u7d22');
    expect(html).toContain('\u548c = 12');
    expect(html).toContain('\u500d\u6570 = 2');
  });

  it('renders summary scenes with a dedicated answer block', () => {
    const html = renderToStaticMarkup(
      React.createElement(SceneLayoutRenderer, {
        sceneType: 'summary',
        visuals: {
          heading: '\u5199\u51fa\u6700\u7ec8\u7b54\u6848',
          detail: '\u56de\u987e\u89e3\u9898\u5957\u8def',
          formulas: ['2x = 8', 'x = 4'],
          answer: 'x = 4',
          takeaway: '\u63d0\u5206\u62c6\u89e3\uff1a\u5148\u6293\u5173\u952e\u5173\u7cfb\uff0c\u518d\u5199\u51fa\u6700\u7ec8\u7ed3\u8bba\u3002',
          layout: 'summary',
          layoutLabel: '\u603b\u7ed3\u6536\u675f',
          narration: '\u6240\u4ee5\u6700\u7ec8\u7b54\u6848\u662f x \u7b49\u4e8e 4'
        }
      })
    );

    expect(html).toContain('\u6700\u7ec8\u7b54\u6848');
    expect(html).toContain('x = 4');
    expect(html).toContain('\u89e3\u9898\u5957\u8def');
    expect(html).toContain('\u5e26\u8d70\u4e00\u53e5');
    expect(html).toContain('\u63d0\u5206\u62c6\u89e3\uff1a\u5148\u6293\u5173\u952e\u5173\u7cfb\uff0c\u518d\u5199\u51fa\u6700\u7ec8\u7ed3\u8bba\u3002');
    expect(html).toContain('\u4e3e\u4e00\u53cd\u4e09');
    expect(html).toContain('\u540c\u7c7b\u9898\u4e5f\u80fd\u4e00\u952e\u751f\u6210\u8bb2\u89e3');
  });

  it('renders problem scenes with a dedicated keyword block', () => {
    const html = renderToStaticMarkup(
      React.createElement(SceneLayoutRenderer, {
        sceneType: 'problem',
        visuals: {
          heading: '\u8bfb\u51fa\u6570\u91cf\u5173\u7cfb',
          detail: '\u5148\u627e\u5230\u548c\u4e0e\u500d\u6570\u8fd9\u4e24\u4e2a\u6761\u4ef6',
          formulas: ['\u548c = 12', '\u500d\u6570 = 2'],
          highlights: ['\u548c = 12', '\u500d\u6570 = 2'],
          layout: 'problem_card',
          layoutLabel: '\u9898\u76ee\u5361\u7247',
          narration: '\u5148\u5728\u9898\u76ee\u91cc\u627e\u5230\u548c\u500d\u6570'
        }
      })
    );

    expect(html).toContain('\u9898\u76ee\u62c6\u89e3');
    expect(html).toContain('\u672c\u9898\u5173\u952e\u8bcd');
    expect(html).toContain('\u8001\u5e08\u63d0\u793a');
    expect(html).toContain('\u5148\u5708\u51fa\u5df2\u77e5\u6761\u4ef6');
    expect(html).toContain('\u548c = 12');
    expect(html).toContain('\u500d\u6570 = 2');
  });

  it('renders comparison scenes with wrong-vs-right teaching guidance', () => {
    const html = renderToStaticMarkup(
      React.createElement(SceneLayoutRenderer, {
        sceneType: 'warning',
        visuals: {
          heading: '\u6613\u9519\u63d0\u9192',
          detail: '\u8fd9\u4e00\u6b65\u6700\u5bb9\u6613\u51fa\u9519',
          formulas: ['\u53ea\u79fb\u4e00\u8fb9', '\u4e24\u8fb9\u540c\u65f6\u64cd\u4f5c'],
          highlights: ['\u7b49\u5f0f\u4e24\u8fb9'],
          layout: 'comparison',
          layoutLabel: '\u5bf9\u6bd4\u8bb2\u89e3',
          mistake: {
            wrong: '\u53ea\u79fb\u4e00\u8fb9',
            correct: '\u4e24\u8fb9\u540c\u65f6\u51cf 3',
            tip: '\u8bb0\u4f4f\u7b49\u5f0f\u4e24\u8fb9\u8981\u505a\u540c\u4e00\u4e2a\u53d8\u5316'
          },
          narration: '\u8fd9\u4e00\u6b65\u4e00\u5b9a\u8981\u8bb0\u5f97\u4e24\u8fb9\u540c\u65f6\u53d8\u5316'
        }
      })
    );

    expect(html).toContain('\u5e38\u89c1\u9519\u6cd5');
    expect(html).toContain('\u6b63\u786e\u505a\u6cd5');
    expect(html).toContain('\u8001\u5e08\u63d0\u9192');
    expect(html).toContain('\u8fd9\u4e00\u6b65\u6700\u5bb9\u6613\u5931\u5206');
    expect(html).toContain('\u4e24\u8fb9\u540c\u65f6\u51cf 3');
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

  it('maps each teaching scene type to a reusable presenter action state', () => {
    expect(getPresenterStateForScene('title')).toBe('welcome_wave');
    expect(getPresenterStateForScene('problem')).toBe('idle_teach');
    expect(getPresenterStateForScene('step')).toBe('point_explain');
    expect(getPresenterStateForScene('warning')).toBe('warning_alert');
    expect(getPresenterStateForScene('summary')).toBe('summary_cheer');
    expect(getPresenterStateForScene('future_subject_scene')).toBe('idle_teach');
  });

  it('renders formula board with primary and answer emphasis', () => {
    const html = renderToStaticMarkup(
      React.createElement(FormulaBoard, {
        formulas: ['x + 2x = 12', 'x = 4', '2x = 8'],
        highlights: ['x = 4'],
        sceneType: 'step'
      })
    );

    expect(html).toContain('\u516c\u5f0f\u677f\u4e66');
    expect(html).toContain('\u539f\u5f0f');
    expect(html).toContain('\u5173\u952e\u5f0f');
    expect(html).toContain('\u5173\u952e\u53d8\u5f62');
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
    expect(html).toContain('\u4e2d\u5b66\u6570\u5b66');
    expect(html).toContain('\u9010\u6b65\u62c6\u89e3');
    expect(html).toContain('1/6');
    expect(html).toContain('\u6570\u91cf\u5173\u7cfb\u5e94\u7528\u9898');
    expect(html).toContain('Love Learning');
    expect(html).toContain('\u8bb2\u5e08\u77ed\u89c6\u9891\u6a21\u677f');
  });

  it('renders a fixed red panda teacher presenter with scene-aware action copy', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        ShortVideoShell,
        {
          sceneType: 'warning',
          sceneNumber: 4,
          title: '\u6613\u9519\u63d0\u9192',
          totalScenes: 6
        },
        React.createElement('p', null, 'content')
      )
    );

    expect(html).toContain('data-presenter-state="warning_alert"');
    expect(html).toContain('\u5c0f\u718a\u732b\u8001\u5e08');
    expect(html).toContain('\u773c\u955c');
    expect(html).toContain('\u6613\u9519\u63d0\u9192');
  });

  it('renders presenter micro-motion from reusable scene progress', () => {
    const html = renderToStaticMarkup(
      React.createElement(PresenterMascot, {
        sceneProgress: 0.5,
        sceneType: 'step'
      } as React.ComponentProps<typeof PresenterMascot>)
    );

    expect(html).toContain('data-presenter-motion="active"');
    expect(html).toContain('data-presenter-progress="0.50"');
    expect(html).toContain('\u7728\u773c');
    expect(html).toContain('\u9759\u97f3\u966a\u4f34');
  });

  it('marks presenter mouth motion as TTS-synced only while narration audio is active', () => {
    const html = renderToStaticMarkup(
      React.createElement(PresenterMascot, {
        sceneProgress: 0.25,
        sceneType: 'step',
        speechActivity: 'speaking'
      } as React.ComponentProps<typeof PresenterMascot>)
    );

    expect(html).toContain('data-presenter-speech="speaking"');
    expect(html).toContain('data-mouth-sync="tts"');
    expect(html).toContain('\u0054\u0054\u0053\u53e3\u64ad\u540c\u6b65');
  });

  it('pauses presenter mouth motion between narration speech windows', () => {
    const html = renderToStaticMarkup(
      React.createElement(PresenterMascot, {
        sceneProgress: 0.12,
        sceneType: 'step',
        speechActivity: 'speaking',
        speechWindows: [
          {start: 0.22, end: 0.42},
          {start: 0.52, end: 0.82}
        ]
      } as React.ComponentProps<typeof PresenterMascot>)
    );

    expect(html).toContain('data-presenter-speech="paused"');
    expect(html).toContain('data-mouth-sync="pause"');
    expect(html).toContain('\u53e3\u64ad\u505c\u987f');
  });

  it('renders presenter teaching cues for formula emphasis', () => {
    const html = renderToStaticMarkup(
      React.createElement(PresenterMascot, {
        sceneProgress: 0.46,
        sceneType: 'step',
        teachingCue: 'formula_pointer',
        teachingTarget: 'formula_board'
      } as React.ComponentProps<typeof PresenterMascot>)
    );

    expect(html).toContain('data-teaching-cue="formula_pointer"');
    expect(html).toContain('data-teaching-target="formula_board"');
    expect(html).toContain('\u6307\u5411\u516c\u5f0f\u677f\u4e66');
    expect(html).toContain('\u7bad\u5934\u6307\u5411\u516c\u5f0f\u677f\u4e66\u533a');
  });

  it('renders eased scene progress as a teaching rhythm bar', () => {
    const html = renderToStaticMarkup(React.createElement(SceneProgress, {progress: 0.42}));

    expect(html).toContain('aria-label="\u89c6\u9891\u8bb2\u89e3\u8fdb\u5ea6"');
    expect(html).toContain('42%');
    expect(html).toContain('\u63a8\u8fdb\u53d8\u5f62');
  });

  it('renders subtitle cards with a teaching-style caption chrome', () => {
    const html = renderToStaticMarkup(
      React.createElement(Subtitle, {
        text: '\u5148\u8ba9\u7b49\u5f0f\u4e24\u8fb9\u540c\u65f6\u51cf\u53bb 3\u3002'
      })
    );

    expect(html).toContain('\u8bb2\u5e08\u53e3\u64ad');
    expect(html).toContain('\u5148\u8ba9\u7b49\u5f0f\u4e24\u8fb9\u540c\u65f6\u51cf\u53bb 3\u3002');
    expect(html).toContain('\u5b57\u5e55\u8ddf\u8bfb');
  });
});
