import type {LessonPlan, VideoProject, VideoScene} from '../../shared-types/src';

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
