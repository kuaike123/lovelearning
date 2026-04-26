import {Injectable} from '@nestjs/common';
import {randomUUID} from 'node:crypto';

import {mapLessonToScenes} from '../../../../packages/lesson-engine/src/map-lesson-to-scenes';
import {parseProblem} from '../../../../packages/lesson-engine/src/parse-problem';
import {planLinearEquationLesson} from '../../../../packages/lesson-engine/src/plan-linear-equation-lesson';
import {runJob} from '../../../../packages/job-runner/src/run-job';
import {renderProject} from '../../../../packages/job-runner/src/render-project';
import {storeArtifacts} from '../../../../packages/job-runner/src/store-artifacts';
import type {ProblemInput} from '../../../../packages/shared-types/src';
import {buildSubtitles} from '../../../../packages/tts-service/src/build-subtitles';
import {synthesizeSceneAudio} from '../../../../packages/tts-service/src/synthesize-scene-audio';
import {getArtifactRoot} from '../artifacts/artifact-root';
import {CreateJobDto} from './dto/create-job.dto';
import {listRecoveredJobsFromArtifacts, recoverJobFromArtifacts} from './job-artifacts';
import {JobsRepository} from './jobs.repository';

@Injectable()
export class JobsService {
  private readonly jobsRepository = new JobsRepository();

  create(input: unknown) {
    const parsedInput = CreateJobDto.parse(input);

    const job = {
      jobId: randomUUID(),
      status: 'queued',
      stage: 'queued',
      createdAt: new Date().toISOString(),
      taskName: buildTaskName(parsedInput),
      problemText: parsedInput.content
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

  private async completeJob(jobId: string, input: ProblemInput) {
    try {
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
        planLesson: planLinearEquationLesson,
        mapLessonToScenes,
        synthesizeSceneAudio,
        buildSubtitles,
        renderProject,
        storeArtifacts: (artifacts: Parameters<typeof storeArtifacts>[0]) =>
          storeArtifacts({
            ...artifacts,
            jobId,
            artifactRoot: getArtifactRoot(),
            metadata: {
              problemText: input.content,
              taskName: buildTaskName(input)
            },
            publicBaseUrl: 'http://localhost:3001/artifacts'
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

  return input.content.trim().slice(0, 80) || '数学讲解任务';
};
