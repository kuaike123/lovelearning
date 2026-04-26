import {describe, expect, it} from 'vitest';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

import {getSceneVisuals} from '../../packages/renderer/src/lib/scene-visuals';
import {formatSceneType} from '../../packages/renderer/src/compositions/LessonVideo';
import {EquationTransformScene} from '../../packages/renderer/src/scenes/EquationTransformScene';
import {MistakeWarningScene} from '../../packages/renderer/src/scenes/MistakeWarningScene';
import {ProblemScene} from '../../packages/renderer/src/scenes/ProblemScene';
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

    expect(html).toContain('课程标题');
    expect(html).toContain('题目展示');
    expect(html).toContain('等式变形');
    expect(html).toContain('易错提醒');
    expect(html).toContain('课堂总结');
  });

  it('formats scene type labels in Chinese for video overlays', () => {
    expect(formatSceneType('title')).toBe('片头');
    expect(formatSceneType('problem')).toBe('读题');
    expect(formatSceneType('step')).toBe('讲解');
    expect(formatSceneType('warning')).toBe('易错提醒');
    expect(formatSceneType('summary')).toBe('总结');
  });
});
