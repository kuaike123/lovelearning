import {Injectable} from '@nestjs/common';
import {randomUUID} from 'node:crypto';
import {join} from 'node:path';

import {mapLessonToScenes} from '../../../../packages/lesson-engine/src/map-lesson-to-scenes';
import {parseProblem} from '../../../../packages/lesson-engine/src/parse-problem';
import {planLessonForProblem} from '../../../../packages/lesson-engine/src/plan-lesson-for-problem';
import {runJob} from '../../../../packages/job-runner/src/run-job';
import {renderProject} from '../../../../packages/job-runner/src/render-project';
import {storeArtifacts} from '../../../../packages/job-runner/src/store-artifacts';
import {recommendVoicePreset, type ProblemInput} from '../../../../packages/shared-types/src';
import {buildSubtitles} from '../../../../packages/tts-service/src/build-subtitles';
import {synthesizeSceneAudio} from '../../../../packages/tts-service/src/synthesize-scene-audio';
import {getArtifactRoot} from '../artifacts/artifact-root';
import {getPublicArtifactBaseUrl} from '../runtime-config';
import {CreateJobDto} from './dto/create-job.dto';
import {listRecoveredJobsFromArtifacts, recoverJobFromArtifacts, removeJobArtifacts} from './job-artifacts';
import {JobsRepository} from './jobs.repository';

@Injectable()
export class JobsService {
  private readonly jobsRepository = new JobsRepository();

  create(input: unknown) {
    const parsedInput = CreateJobDto.parse(input);
    const recommendation = buildRecommendation(parsedInput);

    const job = {
      jobId: randomUUID(),
      status: 'queued',
      stage: 'queued',
      createdAt: new Date().toISOString(),
      taskName: buildTaskName(parsedInput),
      problemText: parsedInput.content,
      voice: parsedInput.voice ?? recommendation.voice,
      speechRate: parsedInput.speechRate ?? recommendation.speechRate,
      narrationTone: recommendation.narrationTone,
      coverTone: recommendation.coverTone
    };

    const saved = this.jobsRepository.save(job);
    void this.completeJob(saved.jobId, parsedInput);

    return saved;
  }

  find(jobId: string) {
    return this.jobsRepository.findById(jobId) ?? recoverJobFromArtifacts(jobId);
  }

  list() {
    const jobs = this.jobsRepository.listRecent();
    const seen = new Set(jobs.map((job) => job.jobId));
    const recoveredJobs = listRecoveredJobsFromArtifacts(20).filter((job) => !seen.has(job.jobId));

    return {
      jobs: [...jobs, ...recoveredJobs].slice(0, 20)
    };
  }

  remove(jobId: string) {
    const deletedFromMemory = this.jobsRepository.delete(jobId);
    const deletedArtifacts = removeJobArtifacts(jobId);

    return {
      deleted: deletedFromMemory || deletedArtifacts
    };
  }

  regenerate(jobId: string) {
    const source = this.find(jobId);

    if (!source) {
      return null;
    }

    const sourceJob = source as {problemText?: unknown; taskName?: unknown};
    const problemText = readString(sourceJob.problemText);

    if (!problemText) {
      return null;
    }

    const sourceTaskName = readString(sourceJob.taskName) ?? problemText;

    return this.create({
      subject: 'math',
      sourceType: 'text',
      grade: 'junior',
      content: problemText,
      taskName: `${sourceTaskName}\uff08\u91cd\u65b0\u751f\u6210\uff09`
    });
  }

  private async completeJob(jobId: string, input: ProblemInput) {
    try {
      const recommendation = buildRecommendation(input);
      const result = await runJob(input, {
        onProgress: (progress: {
          encodedFrames?: number;
          progress?: number;
          renderedFrames?: number;
          stage: string;
          status: string;
          stitchStage?: string;
        }) => {
          this.jobsRepository.update(jobId, progress);
        },
        parseProblem,
        planLesson: async (parsedProblem: Parameters<typeof planLessonForProblem>[0]) => ({
          ...(await planLessonForProblem(parsedProblem)),
          presentation: {
            narrationTone: recommendation.narrationTone,
            coverTone: recommendation.coverTone,
            coverLayout:
              parsedProblem.problemType === 'word_problem_quantity_relation'
                ? 'quantity_story'
                : 'equation_focus'
          }
        }),
        mapLessonToScenes,
        synthesizeSceneAudio: (scene: Parameters<typeof synthesizeSceneAudio>[0]) =>
          synthesizeSceneAudio(scene, {
            outputDir: join(getArtifactRoot(), 'jobs', jobId, 'audio'),
            publicBaseUrl: getPublicArtifactBaseUrl('jobs', jobId, 'audio'),
            voice: input.voice,
            speechRate: input.speechRate
          }),
        buildSubtitles,
        renderProject,
        storeArtifacts: (artifacts: Parameters<typeof storeArtifacts>[0]) =>
          storeArtifacts({
            ...artifacts,
            jobId,
            artifactRoot: getArtifactRoot(),
            metadata: {
              problemText: input.content,
              taskName: buildTaskName(input),
              voice: input.voice ?? recommendation.voice,
              speechRate: input.speechRate ?? recommendation.speechRate,
              narrationTone: recommendation.narrationTone,
              coverTone: recommendation.coverTone
            },
            publicBaseUrl: getPublicArtifactBaseUrl()
          })
      });

      this.jobsRepository.update(jobId, result);
    } catch (error) {
      this.jobsRepository.update(jobId, {
        status: 'failed',
        stage: 'job_runner',
        error: error instanceof Error ? error.message : 'Unknown job failure'
      });
    }
  }
}

const buildTaskName = (input: ProblemInput) => {
  const explicitName = input.taskName?.trim();

  if (explicitName) return explicitName;

  return input.content.trim().slice(0, 80) || '\u6570\u5b66\u8bb2\u89e3\u4efb\u52a1';
};

const readString = (value: unknown) => (typeof value === 'string' && value.trim() ? value : undefined);

const buildRecommendation = (input: ProblemInput) => {
  return recommendVoicePreset({
    content: input.content,
    style: input.style ?? 'teacher',
    targetDurationSec: normalizeDuration(input.targetDurationSec)
  });
};

const normalizeDuration = (duration: number | undefined): 30 | 45 | 60 => {
  if (duration === 30 || duration === 45 || duration === 60) {
    return duration;
  }

  return 45;
};
