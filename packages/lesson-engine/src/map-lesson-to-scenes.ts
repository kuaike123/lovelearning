import type {LessonPlan, LessonStep, VideoProject, VideoScene, VisualInstruction} from '../../shared-types/src';

const stepToSceneType = (stepType: string): VideoScene['sceneType'] => {
  if (stepType === 'warn_mistake') return 'warning';
  if (stepType === 'summary') return 'summary';
  if (stepType === 'show_problem') return 'problem';
  return 'step';
};

export const mapLessonToScenes = (plan: LessonPlan): VideoProject => {
  const scenes: VideoScene[] = [
    {
      id: 'title',
      sceneType: 'title',
      durationSec: 3,
      subtitle: plan.title,
      transition: 'fade' as const,
      visualInstruction: {
        layout: 'title_card',
        primaryText: plan.title,
        detail: plan.learningGoal,
        motionPreset: 'reveal'
      },
      props: {
        title: plan.title,
        learningGoal: plan.learningGoal
      }
    },
    ...plan.steps.map((step) => ({
      id: step.id,
      sceneType: stepToSceneType(step.stepType),
      durationSec: step.expectedDurationSec ?? 8,
      subtitle: step.narration,
      transition: 'slide' as const,
      visualInstruction: buildVisualInstruction(step),
      props: {
        teachingGoal: step.teachingGoal,
        visualIntent: step.visualIntent,
        keyText: step.keyText ?? [],
        animationHint: step.animationHint ?? 'highlight'
      }
    }))
  ];

  return {
    compositionId: 'LessonVideo',
    fps: 30,
    width: 1080,
    height: 1920,
    theme: 'clean_classroom',
    scenes,
    totalDurationSec: scenes.reduce((sum, scene) => sum + scene.durationSec, 0)
  };
};

const buildVisualInstruction = (step: LessonStep): VisualInstruction => {
  const formulaBlocks = step.keyText?.filter((item) => item.trim().length > 0) ?? [];
  const base = {
    primaryText: step.teachingGoal,
    detail: step.visualIntent,
    formulaBlocks,
    highlights: formulaBlocks,
    motionPreset: mapMotionPreset(step)
  } satisfies Partial<VisualInstruction>;

  if (step.stepType === 'show_problem') {
    return {
      ...base,
      layout: 'problem_card'
    };
  }

  if (step.stepType === 'summary') {
    return {
      ...base,
      layout: 'summary',
      answer: formulaBlocks[0] ?? step.teachingGoal,
      motionPreset: 'emphasis'
    };
  }

  if (step.stepType === 'warn_mistake') {
    return {
      ...base,
      layout: 'comparison',
      motionPreset: 'compare'
    };
  }

  return {
    ...base,
    layout: 'formula_focus'
  };
};

const mapMotionPreset = (step: LessonStep): VisualInstruction['motionPreset'] => {
  if (step.animationHint === 'compare') return 'compare';
  if (step.animationHint === 'replace' || step.animationHint === 'move') return 'transform';
  if (step.stepType === 'summary') return 'emphasis';
  return 'reveal';
};
