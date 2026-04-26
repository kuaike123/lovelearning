import {describe, expect, it, vi} from 'vitest';

import {runJob} from '../../packages/job-runner/src/run-job';

describe('runJob', () => {
  it('returns completed assets for a successful pipeline run', async () => {
    const result = await runJob(
      {
        subject: 'math',
        sourceType: 'text',
        content: 'Solve equation: 2x + 3 = 11'
      },
      {
        parseProblem: vi.fn().mockResolvedValue({
          subject: 'math',
          grade: 'junior',
          problemType: 'linear_equation_one_variable',
          difficulty: 'easy',
          originalText: 'Solve equation: 2x + 3 = 11',
          normalizedExpression: '2x + 3 = 11',
          isSupported: true,
          knowledgePoints: ['linear equation']
        }),
        planLesson: vi.fn().mockResolvedValue({
          title: 'Equation lesson',
          learningGoal: 'Solve the equation',
          steps: [
            {
              id: 's1',
              stepType: 'show_problem',
              teachingGoal: 'Show the problem',
              narration: 'Read the equation.',
              visualIntent: 'Show the original equation'
            }
          ]
        }),
        mapLessonToScenes: vi.fn().mockReturnValue({
          compositionId: 'LessonVideo',
          fps: 30,
          width: 1080,
          height: 1920,
          theme: 'clean_classroom',
          totalDurationSec: 8,
          scenes: [
            {
              id: 's1',
              sceneType: 'problem',
              durationSec: 8,
              subtitle: 'Read the equation.',
              props: {}
            }
          ]
        }),
        synthesizeSceneAudio: vi.fn().mockResolvedValue({
          audioUrl: 'mock://audio/s1.mp3',
          durationSec: 8
        }),
        buildSubtitles: vi.fn().mockReturnValue([
          {id: 's1', startMs: 0, endMs: 8000, text: 'Read the equation.'}
        ]),
        renderProject: vi.fn().mockResolvedValue({
          videoPath: 'C:/tmp/job-1.mp4',
          coverPath: 'C:/tmp/job-1.png'
        }),
        storeArtifacts: vi.fn().mockResolvedValue({
          videoUrl: 'http://localhost:3001/artifacts/jobs/job-1/output.mp4',
          coverUrl: 'http://localhost:3001/artifacts/jobs/job-1/cover.png',
          lessonPlanUrl: 'http://localhost:3001/artifacts/jobs/job-1/lesson.json',
          subtitleUrl: 'http://localhost:3001/artifacts/jobs/job-1/subtitles.srt'
        })
      }
    );

    expect(result.status).toBe('completed');
    expect(result.videoUrl).toBe('http://localhost:3001/artifacts/jobs/job-1/output.mp4');
    expect(result.coverUrl).toBe('http://localhost:3001/artifacts/jobs/job-1/cover.png');
  });

  it('reports pipeline progress stages in order', async () => {
    const progress: Array<{status: string; stage: string}> = [];

    await runJob(
      {
        subject: 'math',
        sourceType: 'text',
        content: 'Solve equation: 2x + 3 = 11'
      },
      {
        onProgress: (next: {status: string; stage: string}) => progress.push(next),
        parseProblem: vi.fn().mockResolvedValue({
          subject: 'math',
          grade: 'junior',
          problemType: 'linear_equation_one_variable',
          difficulty: 'easy',
          originalText: 'Solve equation: 2x + 3 = 11',
          normalizedExpression: '2x + 3 = 11',
          isSupported: true,
          knowledgePoints: ['linear equation']
        }),
        planLesson: vi.fn().mockResolvedValue({
          title: 'Equation lesson',
          learningGoal: 'Solve the equation',
          steps: [
            {
              id: 's1',
              stepType: 'show_problem',
              teachingGoal: 'Show the problem',
              narration: 'Read the equation.',
              visualIntent: 'Show the original equation'
            }
          ]
        }),
        mapLessonToScenes: vi.fn().mockReturnValue({
          compositionId: 'LessonVideo',
          fps: 30,
          width: 1080,
          height: 1920,
          theme: 'clean_classroom',
          totalDurationSec: 8,
          scenes: [
            {
              id: 's1',
              sceneType: 'problem',
              durationSec: 8,
              subtitle: 'Read the equation.',
              props: {}
            }
          ]
        }),
        synthesizeSceneAudio: vi.fn().mockResolvedValue({
          audioUrl: 'mock://audio/s1.mp3',
          durationSec: 8
        }),
        buildSubtitles: vi.fn().mockReturnValue([
          {id: 's1', startMs: 0, endMs: 8000, text: 'Read the equation.'}
        ]),
        renderProject: vi.fn().mockResolvedValue({
          videoPath: 'C:/tmp/job-1.mp4',
          coverPath: 'C:/tmp/job-1.png'
        }),
        storeArtifacts: vi.fn().mockResolvedValue({
          videoUrl: 'http://localhost:3001/artifacts/jobs/job-1/output.mp4',
          coverUrl: 'http://localhost:3001/artifacts/jobs/job-1/cover.png',
          lessonPlanUrl: 'http://localhost:3001/artifacts/jobs/job-1/lesson.json',
          subtitleUrl: 'http://localhost:3001/artifacts/jobs/job-1/subtitles.srt'
        })
      }
    );

    expect(progress.map((entry) => entry.stage)).toEqual([
      'parse',
      'plan',
      'map',
      'audio',
      'subtitles',
      'render',
      'store',
      'done'
    ]);
    expect(progress.every((entry) => entry.status === 'running' || entry.status === 'completed')).toBe(true);
  });

  it('forwards render progress updates from the renderer', async () => {
    const progress: Array<{status: string; stage: string; progress?: number}> = [];

    await runJob(
      {
        subject: 'math',
        sourceType: 'text',
        content: 'Solve equation: 2x + 3 = 11'
      },
      {
        onProgress: (next: {status: string; stage: string; progress?: number}) => progress.push(next),
        parseProblem: vi.fn().mockResolvedValue({
          subject: 'math',
          grade: 'junior',
          problemType: 'linear_equation_one_variable',
          difficulty: 'easy',
          originalText: 'Solve equation: 2x + 3 = 11',
          normalizedExpression: '2x + 3 = 11',
          isSupported: true,
          knowledgePoints: ['linear equation']
        }),
        planLesson: vi.fn().mockResolvedValue({
          title: 'Equation lesson',
          learningGoal: 'Solve the equation',
          steps: [
            {
              id: 's1',
              stepType: 'show_problem',
              teachingGoal: 'Show the problem',
              narration: 'Read the equation.',
              visualIntent: 'Show the original equation'
            }
          ]
        }),
        mapLessonToScenes: vi.fn().mockReturnValue({
          compositionId: 'LessonVideo',
          fps: 30,
          width: 1080,
          height: 1920,
          theme: 'clean_classroom',
          totalDurationSec: 8,
          scenes: [
            {
              id: 's1',
              sceneType: 'problem',
              durationSec: 8,
              subtitle: 'Read the equation.',
              props: {}
            }
          ]
        }),
        synthesizeSceneAudio: vi.fn().mockResolvedValue({
          audioUrl: 'mock://audio/s1.mp3',
          durationSec: 8
        }),
        buildSubtitles: vi.fn().mockReturnValue([
          {id: 's1', startMs: 0, endMs: 8000, text: 'Read the equation.'}
        ]),
        renderProject: vi.fn().mockImplementation(async (_project, options) => {
          options.onProgress({progress: 0.42, renderedFrames: 12, encodedFrames: 8});
          return {
            videoPath: 'C:/tmp/job-1.mp4',
            coverPath: 'C:/tmp/job-1.png'
          };
        }),
        storeArtifacts: vi.fn().mockResolvedValue({
          videoUrl: 'http://localhost:3001/artifacts/jobs/job-1/output.mp4',
          coverUrl: 'http://localhost:3001/artifacts/jobs/job-1/cover.png',
          lessonPlanUrl: 'http://localhost:3001/artifacts/jobs/job-1/lesson.json',
          subtitleUrl: 'http://localhost:3001/artifacts/jobs/job-1/subtitles.srt'
        })
      }
    );

    expect(progress).toContainEqual({
      status: 'running',
      stage: 'render',
      progress: 42,
      renderedFrames: 12,
      encodedFrames: 8
    });
  });
});
