import type {VideoScene} from '../../../shared-types/src';

export type SceneVisuals = {
  detail?: string;
  formulas: string[];
  heading: string;
  narration: string;
};

export const getSceneVisuals = (scene: VideoScene): SceneVisuals => {
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
