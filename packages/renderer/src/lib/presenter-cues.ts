export type PresenterTeachingCue =
  | 'diagram_pointer'
  | 'formula_pointer'
  | 'none'
  | 'reading_guide'
  | 'summary_reward'
  | 'warning_flash';

export type PresenterTeachingTarget =
  | 'comparison_card'
  | 'diagram_area'
  | 'formula_board'
  | 'none'
  | 'problem_keywords'
  | 'summary_answer';

type PresenterCueInput = {
  layout?: string;
  sceneType: string;
};

const cueTargetMap: Record<PresenterTeachingCue, PresenterTeachingTarget> = {
  diagram_pointer: 'diagram_area',
  formula_pointer: 'formula_board',
  none: 'none',
  reading_guide: 'problem_keywords',
  summary_reward: 'summary_answer',
  warning_flash: 'comparison_card'
};

export const getPresenterCueForScene = ({layout, sceneType}: PresenterCueInput): PresenterTeachingCue => {
  if (sceneType === 'warning' || layout === 'comparison') return 'warning_flash';
  if (sceneType === 'summary' || layout === 'summary') return 'summary_reward';
  if (layout === 'formula_focus') return 'formula_pointer';
  if (layout === 'diagram') return 'diagram_pointer';
  if (layout === 'problem_card') return 'reading_guide';

  return 'none';
};

export const getPresenterTargetForCue = (cue: PresenterTeachingCue): PresenterTeachingTarget => cueTargetMap[cue];
