import {describe, expect, it} from 'vitest';

import type {LessonPlan} from '../../packages/shared-types/src';

import {mapLessonToScenes} from '../../packages/lesson-engine/src/map-lesson-to-scenes';

describe('mapLessonToScenes', () => {
  it('adds title, step, and summary scenes in deterministic order', () => {
    const project = mapLessonToScenes({
      title: 'Equation lesson',
      learningGoal: 'Solve the equation',
      summary: 'The answer is x = 4',
      steps: [
        {
          id: 's1',
          stepType: 'show_problem',
          teachingGoal: 'Show the problem',
          narration: 'Read the equation.',
          visualIntent: 'Display the equation',
          keyText: ['2x + 3 = 11']
        },
        {
          id: 's2',
          stepType: 'summary',
          teachingGoal: 'State the answer',
          narration: 'The answer is x equals 4.',
          visualIntent: 'Show the final answer',
          keyText: ['x = 4']
        }
      ]
    } satisfies LessonPlan);

    expect(project.compositionId).toBe('LessonVideo');
    expect(project.scenes[0].sceneType).toBe('title');
    expect(project.scenes.at(-1)?.sceneType).toBe('summary');
  });

  it('adds structured visual instructions for every generated scene', () => {
    const project = mapLessonToScenes({
      title: 'Equation lesson',
      learningGoal: 'Solve the equation',
      summary: 'The answer is x = 4',
      steps: [
        {
          id: 's1',
          stepType: 'show_problem',
          teachingGoal: 'Show the problem',
          narration: 'Read the equation.',
          visualIntent: 'Display the equation',
          keyText: ['2x + 3 = 11']
        },
        {
          id: 's2',
          stepType: 'transform',
          teachingGoal: 'Simplify both sides',
          narration: 'The equation becomes 2x equals 8.',
          visualIntent: 'Reveal the transformed equation',
          keyText: ['2x + 3 = 11', '2x = 8'],
          animationHint: 'replace'
        },
        {
          id: 's3',
          stepType: 'summary',
          teachingGoal: 'State the answer',
          narration: 'The answer is x equals 4.',
          visualIntent: 'Show the final answer',
          keyText: ['x = 4']
        }
      ]
    } satisfies LessonPlan);

    expect(project.scenes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          sceneType: 'title',
          visualInstruction: expect.objectContaining({
            layout: 'title_card',
            motionPreset: 'reveal',
            primaryText: 'Equation lesson'
          })
        }),
        expect.objectContaining({
          id: 's1',
          visualInstruction: expect.objectContaining({
            layout: 'problem_card',
            formulaBlocks: ['2x + 3 = 11'],
            highlights: ['2x + 3 = 11'],
            motionPreset: 'reveal'
          })
        }),
        expect.objectContaining({
          id: 's2',
          visualInstruction: expect.objectContaining({
            layout: 'formula_focus',
            formulaBlocks: ['2x + 3 = 11', '2x = 8'],
            motionPreset: 'transform'
          })
        }),
        expect.objectContaining({
          id: 's3',
          visualInstruction: expect.objectContaining({
            layout: 'summary',
            answer: 'x = 4',
            motionPreset: 'emphasis'
          })
        })
      ])
    );
  });
});
