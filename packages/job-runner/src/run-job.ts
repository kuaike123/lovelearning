import type {ProblemInput} from '../../shared-types/src';

export const runJob = async (input: ProblemInput, deps: any) => {
  const reportProgress = async (stage: string, status = 'running', patch: Record<string, unknown> = {}) => {
    if (deps.onProgress) {
      await deps.onProgress({status, stage, ...patch});
    }
  };

  await reportProgress('parse');
  const parsed = await deps.parseProblem(input);

  if (!parsed.isSupported) {
    await reportProgress('parse', 'failed');
    return {
      status: 'failed',
      stage: 'parse',
      error: parsed.rejectionReason ?? 'Unsupported input'
    };
  }

  await reportProgress('plan');
  const lessonPlan = await deps.planLesson(parsed);
  await reportProgress('map');
  const project = deps.mapLessonToScenes(lessonPlan);

  await reportProgress('audio');
  const scenes = await Promise.all(
    project.scenes.map(async (scene: any) => {
      const audio = await deps.synthesizeSceneAudio(scene);
      return {...scene, audioUrl: audio.audioUrl, durationSec: audio.durationSec};
    })
  );
  const totalDurationSec = scenes.reduce((total: number, scene: {durationSec: number}) => total + scene.durationSec, 0);
  const audioUrls = scenes
    .map((scene: {audioUrl?: string}) => scene.audioUrl)
    .filter((audioUrl: string | undefined): audioUrl is string => Boolean(audioUrl));

  await reportProgress('subtitles');
  const subtitles = deps.buildSubtitles(scenes);
  await reportProgress('render');
  const renderArtifact = await deps.renderProject({...project, scenes, totalDurationSec}, {
    onProgress: (renderProgress: {
      encodedFrames?: number;
      progress?: number;
      renderedFrames?: number;
      stitchStage?: string;
    }) => {
      void reportProgress('render', 'running', {
        encodedFrames: renderProgress.encodedFrames,
        progress: normalizeProgress(renderProgress.progress),
        renderedFrames: renderProgress.renderedFrames,
        stitchStage: renderProgress.stitchStage
      });
    }
  });
  await reportProgress('store');
  const stored = await deps.storeArtifacts({audioUrls, lessonPlan, subtitles, renderArtifact});
  await reportProgress('done', 'completed');

  return {
    status: 'completed',
    stage: 'done',
    videoUrl: stored.videoUrl ?? renderArtifact.videoUrl,
    coverUrl: stored.coverUrl ?? renderArtifact.coverUrl,
    audioUrls: stored.audioUrls ?? audioUrls,
    subtitleUrl: stored.subtitleUrl,
    lessonPlanUrl: stored.lessonPlanUrl
  };
};

const normalizeProgress = (progress: number | undefined) => {
  if (typeof progress !== 'number' || !Number.isFinite(progress)) return undefined;

  return Math.max(0, Math.min(100, Math.round(progress * 100)));
};
