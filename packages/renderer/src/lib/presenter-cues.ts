export type PresenterTeachingCue =
  | 'diagram_pointer'
  | 'formula_pointer'
  | 'none'
  | 'reading_guide'
  | 'summary_reward'
  | 'warning_flash';

type PresenterCueInput = {
  layout?: string;
  sceneType: string;
};

export const getPresenterCueForScene = ({layout, sceneType}: PresenterCueInput): PresenterTeachingCue => {
  if (sceneType === 'warning' || layout === 'comparison') return 'warning_flash';
  if (sceneType === 'summary' || layout === 'summary') return 'summary_reward';
  if (layout === 'formula_focus') return 'formula_pointer';
  if (layout === 'diagram') return 'diagram_pointer';
  if (layout === 'problem_card') return 'reading_guide';

  return 'none';
};
