import {existsSync, readdirSync, readFileSync, rmSync, statSync} from 'node:fs';
import {join, resolve, sep} from 'node:path';

import {getArtifactRoot} from '../artifacts/artifact-root';

const publicBaseUrl = 'http://localhost:3001/artifacts';

type RecoveredJob = {
  jobId: string;
  status: 'completed';
  stage: 'done';
  createdAt: string;
  problemText: string;
  taskName: string;
  voice?: 'female_warm' | 'female_clear' | 'male_calm';
  speechRate?: 'slow' | 'normal' | 'fast';
  narrationTone?: string;
  coverTone?: string;
  videoUrl: string;
  coverUrl: string;
  subtitleUrl: string;
  lessonPlanUrl: string;
};

export const recoverJobFromArtifacts = (jobId: string): RecoveredJob | null => {
  try {
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
    const taskName = metadata.taskName ?? lesson.title ?? '\u5df2\u6062\u590d\u8bb2\u89e3\u4efb\u52a1';
    const problemText = metadata.problemText ?? lesson.title ?? taskName;

    return {
      jobId,
      status: 'completed',
      stage: 'done',
      createdAt,
      problemText,
      taskName,
      voice: metadata.voice,
      speechRate: metadata.speechRate,
      narrationTone: metadata.narrationTone,
      coverTone: metadata.coverTone,
      videoUrl: `${publicBaseUrl}/jobs/${jobId}/output.mp4`,
      coverUrl: `${publicBaseUrl}/jobs/${jobId}/cover.png`,
      subtitleUrl: `${publicBaseUrl}/jobs/${jobId}/subtitles.srt`,
      lessonPlanUrl: `${publicBaseUrl}/jobs/${jobId}/lesson.json`
    };
  } catch {
    return null;
  }
};

export const listRecoveredJobsFromArtifacts = (limit = 20) => {
  const jobsRoot = join(getArtifactRoot(), 'jobs');

  if (!existsSync(jobsRoot)) {
    return [];
  }

  const normalizedLimit = Math.max(limit, 1);
  const recentCandidates = readdirSync(jobsRoot, {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => readArtifactDirectorySummary(jobsRoot, entry.name))
    .filter((entry): entry is {name: string; modifiedAt: number} => entry !== null)
    .sort((left, right) => right.modifiedAt - left.modifiedAt)
    .slice(0, normalizedLimit * 3);

  return recentCandidates
    .map((entry) => recoverJobFromArtifacts(entry.name))
    .filter((job): job is RecoveredJob => job !== null)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, normalizedLimit);
};

export const removeJobArtifacts = (jobId: string) => {
  const jobsRoot = resolve(getArtifactRoot(), 'jobs');
  const jobDir = resolve(jobsRoot, jobId);

  if (jobDir === jobsRoot || !jobDir.startsWith(`${jobsRoot}${sep}`)) {
    return false;
  }

  rmSync(jobDir, {force: true, recursive: true});
  return true;
};

const readArtifactDirectorySummary = (jobsRoot: string, name: string) => {
  try {
    return {
      name,
      modifiedAt: statSync(join(jobsRoot, name)).mtimeMs
    };
  } catch {
    return null;
  }
};

const readMetadata = (
  metadataPath: string
): {
  problemText?: string;
  taskName?: string;
  voice?: 'female_warm' | 'female_clear' | 'male_calm';
  speechRate?: 'slow' | 'normal' | 'fast';
  narrationTone?: string;
  coverTone?: string;
} => {
  if (!existsSync(metadataPath)) {
    return {};
  }

  try {
    const parsed = JSON.parse(readFileSync(metadataPath, 'utf8')) as {
      problemText?: unknown;
      speechRate?: unknown;
      taskName?: unknown;
      voice?: unknown;
      narrationTone?: unknown;
      coverTone?: unknown;
    };

    return {
      problemText: typeof parsed.problemText === 'string' ? parsed.problemText : undefined,
      taskName: typeof parsed.taskName === 'string' ? parsed.taskName : undefined,
      voice: readVoice(parsed.voice),
      speechRate: readSpeechRate(parsed.speechRate),
      narrationTone: readNonEmptyString(parsed.narrationTone),
      coverTone: readNonEmptyString(parsed.coverTone)
    };
  } catch {
    return {};
  }
};

const readVoice = (value: unknown) => {
  if (value === 'female_warm' || value === 'female_clear' || value === 'male_calm') {
    return value;
  }

  return undefined;
};

const readSpeechRate = (value: unknown) => {
  if (value === 'slow' || value === 'normal' || value === 'fast') {
    return value;
  }

  return undefined;
};

const readNonEmptyString = (value: unknown) => {
  return typeof value === 'string' && value.trim() ? value : undefined;
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
