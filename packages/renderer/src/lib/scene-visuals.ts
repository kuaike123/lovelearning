import type {VideoScene} from '../../../shared-types/src';

import {getSceneRenderer} from './scene-renderer-registry';

export type SceneVisuals = {
  detail?: string;
  formulas: string[];
  heading: string;
  layoutLabel?: string;
  motionPreset?: string;
  narration: string;
};

export const getSceneVisuals = (scene: VideoScene): SceneVisuals => {
  if (scene.visualInstruction) {
    const visual = scene.visualInstruction;
    const renderer = getSceneRenderer(visual.layout);
    const formulas = visual.formulaBlocks?.filter((item) => item.trim().length > 0) ?? [];

    return {
      detail: visual.detail,
      formulas: formulas.length > 0 ? formulas : [visual.primaryText ?? scene.subtitle],
      heading: visual.primaryText ?? scene.subtitle,
      layoutLabel: renderer.label,
      motionPreset: visual.motionPreset,
      narration: scene.subtitle
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
