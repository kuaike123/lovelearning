import type {VisualInstruction} from '../../../shared-types/src';

export type SceneRendererDefinition = {
  layout: VisualInstruction['layout'];
  label: string;
};

const sceneRenderers: Record<VisualInstruction['layout'], SceneRendererDefinition> = {
  comparison: {
    layout: 'comparison',
    label: '\u5bf9\u6bd4\u8bb2\u89e3'
  },
  diagram: {
    layout: 'diagram',
    label: '\u56fe\u5f62\u6f14\u793a'
  },
  formula_focus: {
    layout: 'formula_focus',
    label: '\u516c\u5f0f\u805a\u7126'
  },
  problem_card: {
    layout: 'problem_card',
    label: '\u9898\u76ee\u5361\u7247'
  },
  summary: {
    layout: 'summary',
    label: '\u603b\u7ed3\u6536\u675f'
  },
  title_card: {
    layout: 'title_card',
    label: '\u5c01\u9762\u7247\u5934'
  }
};

export const getSceneRenderer = (layout: VisualInstruction['layout']) => {
  return sceneRenderers[layout];
};
