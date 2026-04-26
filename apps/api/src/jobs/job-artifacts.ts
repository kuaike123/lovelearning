import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import {join} from 'node:path';

import {getArtifactRoot} from '../artifacts/artifact-root';

const publicBaseUrl = 'http://localhost:3001/artifacts';

type RecoveredJob = {
  jobId: string;
  status: 'completed';
  stage: 'done';
  createdAt: string;
  problemText: string;
  taskName: string;
  videoUrl: string;
  coverUrl: string;
  subtitleUrl: string;
  lessonPlanUrl: string;
};

export const recoverJobFromArtifacts = (jobId: string): RecoveredJob | null => {
  const jobDir = join(getArtifactRoot(), 'jobs', jobId);
  const lessonPath = join(jobDir, 'lesson.json');
  const metadataPath = join(jobDir, 'job.json');
  const requiredFiles = [
    lessonPath,
    join(jobDir, 'output.mp4'),
    join(jobDir, 'cover.png'),
    join(jobDir, 'subtitles.srt')
  ];

  if (!requiredFiles.every((filePath) => existsSync(filePath))) {
    return null;
  }

  const lesson = readLesson(lessonPath);
  const metadata = readMetadata(metadataPath);
  const createdAt = statSync(lessonPath).mtime.toISOString();
  const taskName = metadata.taskName ?? lesson.title ?? '已恢复讲解任务';
  const problemText = metadata.problemText ?? lesson.title ?? taskName;

  return {
    jobId,
    status: 'completed',
    stage: 'done',
    createdAt,
    problemText,
    taskName,
    videoUrl: `${publicBaseUrl}/jobs/${jobId}/output.mp4`,
    coverUrl: `${publicBaseUrl}/jobs/${jobId}/cover.png`,
    subtitleUrl: `${publicBaseUrl}/jobs/${jobId}/subtitles.srt`,
    lessonPlanUrl: `${publicBaseUrl}/jobs/${jobId}/lesson.json`
  };
};

const readMetadata = (metadataPath: string): {problemText?: string; taskName?: string} => {
  if (!existsSync(metadataPath)) {
    return {};
  }

  try {
    const parsed = JSON.parse(readFileSync(metadataPath, 'utf8')) as {
      problemText?: unknown;
      taskName?: unknown;
    };

    return {
      problemText: typeof parsed.problemText === 'string' ? parsed.problemText : undefined,
      taskName: typeof parsed.taskName === 'string' ? parsed.taskName : undefined
    };
  } catch {
    return {};
  }
};

export const listRecoveredJobsFromArtifacts = (limit = 20) => {
  const jobsRoot = join(getArtifactRoot(), 'jobs');

  if (!existsSync(jobsRoot)) {
    return [];
  }

  return readdirSync(jobsRoot, {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      modifiedAt: statSync(join(jobsRoot, entry.name)).mtimeMs
    }))
    .sort((left, right) => right.modifiedAt - left.modifiedAt)
    .slice(0, Math.max(limit, 1))
    .map((entry) => recoverJobFromArtifacts(entry.name))
    .filter((job): job is RecoveredJob => job !== null)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
};

const readLesson = (lessonPath: string): {title?: string} => {
  try {
    const parsed = JSON.parse(readFileSync(lessonPath, 'utf8')) as {title?: unknown};

    return {
      title: typeof parsed.title === 'string' ? parsed.title : undefined
    };
  } catch {
    return {};
  }
};
