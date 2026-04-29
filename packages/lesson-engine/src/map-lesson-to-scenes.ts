import type {LessonPlan, LessonStep, VideoProject, VideoScene, VisualInstruction} from '../../shared-types/src';

const stepToSceneType = (stepType: string): VideoScene['sceneType'] => {
  if (stepType === 'warn_mistake') return 'warning';
  if (stepType === 'summary') return 'summary';
  if (stepType === 'show_problem') return 'problem';
  return 'step';
};

export const mapLessonToScenes = (plan: LessonPlan): VideoProject => {
  const stepScenes: VideoScene[] = plan.steps.map((step) => ({
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
  }));

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
    ...injectWarningScene(stepScenes, plan)
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

const injectWarningScene = (stepScenes: VideoScene[], plan: LessonPlan) => {
  if (!plan.commonMistakes?.length) {
    return stepScenes;
  }

  const warningScene = createWarningScene(plan);
  const firstSummaryIndex = stepScenes.findIndex((scene) => scene.sceneType === 'summary');

  if (firstSummaryIndex === -1) {
    return [...stepScenes, warningScene];
  }

  return [...stepScenes.slice(0, firstSummaryIndex), warningScene, ...stepScenes.slice(firstSummaryIndex)];
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

const createWarningScene = (plan: LessonPlan): VideoScene => {
  const wrong = plan.commonMistakes?.[0] ?? 'Avoid breaking the balance of the equation';
  const tip = plan.commonMistakes?.[1] ?? 'Keep both sides doing the same operation every time';
  const correct = inferCorrectiveMessage(wrong, plan.learningGoal);

  return {
    id: 'common-mistake-warning',
    sceneType: 'warning',
    durationSec: 6,
    subtitle: 'This step is easy to get wrong, so let us compare the wrong method with the correct one.',
    transition: 'slide',
    visualInstruction: {
      layout: 'comparison',
      primaryText: 'Common mistake warning',
      detail: 'Check whether both sides are still balanced after each operation.',
      formulaBlocks: [wrong, correct],
      highlights: ['both sides'],
      mistake: {
        wrong,
        correct,
        tip
      },
      motionPreset: 'compare'
    },
    props: {
      teachingGoal: 'Common mistake warning',
      visualIntent: 'Compare the wrong move and the correct move side by side.',
      keyText: [wrong, correct],
      animationHint: 'compare'
    }
  };
};

const inferCorrectiveMessage = (wrong: string, learningGoal: string) => {
  const normalized = wrong.toLowerCase();

  if (normalized.includes('one side')) {
    return 'Keep both sides balanced through the same operation';
  }

  if (normalized.includes('divide')) {
    return 'Finish by dividing both sides by the coefficient of x';
  }

  return `Follow the target method carefully: ${learningGoal}`;
};

const mapMotionPreset = (step: LessonStep): VisualInstruction['motionPreset'] => {
  if (step.animationHint === 'compare') return 'compare';
  if (step.animationHint === 'replace' || step.animationHint === 'move') return 'transform';
  if (step.stepType === 'summary') return 'emphasis';
  return 'reveal';
};
