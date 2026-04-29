import type {VideoScene} from '../../../shared-types/src';

import {getSceneRenderer} from './scene-renderer-registry';

export type SceneVisuals = {
  answer?: string;
  coverLayout?: 'equation_focus' | 'quantity_story';
  detail?: string;
  eyebrow?: string;
  formulas: string[];
  heading: string;
  highlights?: string[];
  layout: 'title_card' | 'problem_card' | 'formula_focus' | 'comparison' | 'summary' | 'diagram';
  layoutLabel?: string;
  mistake?: {
    correct: string;
    tip: string;
    wrong: string;
  };
  motionPreset?: string;
  narration: string;
  takeaway?: string;
};

export const getSceneVisuals = (scene: VideoScene): SceneVisuals => {
  if (scene.visualInstruction) {
    const visual = scene.visualInstruction;
    const renderer = getSceneRenderer(visual.layout);
    const formulas = visual.formulaBlocks?.filter((item) => item.trim().length > 0) ?? [];

    return {
      answer: visual.answer,
      coverLayout: visual.coverLayout,
      detail: visual.detail,
      eyebrow: visual.eyebrow,
      formulas: formulas.length > 0 ? formulas : [visual.primaryText ?? scene.subtitle],
      heading: visual.primaryText ?? scene.subtitle,
      highlights: visual.highlights,
      layout: visual.layout,
      layoutLabel: renderer.label,
      mistake: visual.mistake,
      motionPreset: visual.motionPreset,
      narration: scene.subtitle
      ,
      takeaway: visual.takeaway
    };
  }

  const props = scene.props as {
    keyText?: unknown;
    learningGoal?: unknown;
    teachingGoal?: unknown;
    title?: unknown;
    visualIntent?: unknown;
  };
  const formulas = extractStringArray(props.keyText);
  const heading = firstString(props.teachingGoal, props.learningGoal, props.title, scene.subtitle);
  const detail = firstString(props.visualIntent);

  return {
    detail,
    formulas: formulas.length > 0 ? formulas : [scene.subtitle],
    heading,
    layout: 'formula_focus',
    narration: scene.subtitle
  };
};

const extractStringArray = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
};

const firstString = (...values: unknown[]) => {
  return values.find((value): value is string => typeof value === 'string' && value.trim().length > 0) ?? '';
};
