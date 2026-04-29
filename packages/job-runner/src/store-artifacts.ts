import {copyFile, mkdir, writeFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';

type SubtitleCue = {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
};

type StoreArtifactsInput = {
  jobId?: string;
  artifactRoot?: string;
  metadata?: {
    problemText?: string;
    taskName?: string;
    voice?: 'female_warm' | 'female_clear' | 'male_calm';
    speechRate?: 'slow' | 'normal' | 'fast';
    narrationTone?: string;
    coverTone?: string;
  };
  publicBaseUrl?: string;
  audioUrls?: string[];
  lessonPlan: unknown;
  subtitles: SubtitleCue[];
  renderArtifact?: {
    videoPath?: string;
    coverPath?: string;
  };
};

export const storeArtifacts = async (artifacts: StoreArtifactsInput) => {
  const jobId = artifacts.jobId ?? 'job';
  const artifactRoot = artifacts.artifactRoot ?? resolve(process.cwd(), 'artifacts');
  const publicBaseUrl = artifacts.publicBaseUrl ?? 'http://localhost:3001/artifacts';
  const jobArtifactDir = join(artifactRoot, 'jobs', jobId);

  await mkdir(jobArtifactDir, {recursive: true});
  if (artifacts.metadata) {
    await writeFile(join(jobArtifactDir, 'job.json'), JSON.stringify(artifacts.metadata, null, 2), 'utf8');
  }
  await writeFile(join(jobArtifactDir, 'lesson.json'), JSON.stringify(artifacts.lessonPlan, null, 2), 'utf8');
  await writeFile(join(jobArtifactDir, 'subtitles.srt'), toSrt(artifacts.subtitles), 'utf8');

  if (artifacts.renderArtifact?.videoPath) {
    await copyFile(artifacts.renderArtifact.videoPath, join(jobArtifactDir, 'output.mp4'));
  }

  if (artifacts.renderArtifact?.coverPath) {
    await copyFile(artifacts.renderArtifact.coverPath, join(jobArtifactDir, 'cover.png'));
  }

  return {
    ...(artifacts.renderArtifact?.videoPath ? {videoUrl: `${publicBaseUrl}/jobs/${jobId}/output.mp4`} : {}),
    ...(artifacts.renderArtifact?.coverPath ? {coverUrl: `${publicBaseUrl}/jobs/${jobId}/cover.png`} : {}),
    ...(artifacts.audioUrls?.length ? {audioUrls: artifacts.audioUrls} : {}),
    lessonPlanUrl: `${publicBaseUrl}/jobs/${jobId}/lesson.json`,
    subtitleUrl: `${publicBaseUrl}/jobs/${jobId}/subtitles.srt`
  };
};

const toSrt = (subtitles: SubtitleCue[]) => {
  return subtitles
    .map((subtitle, index) => {
      return `${index + 1}\n${formatSrtTime(subtitle.startMs)} --> ${formatSrtTime(subtitle.endMs)}\n${subtitle.text}`;
    })
    .join('\n\n');
};

const formatSrtTime = (milliseconds: number) => {
  const clamped = Math.max(0, Math.floor(milliseconds));
  const hours = Math.floor(clamped / 3_600_000);
  const minutes = Math.floor((clamped % 3_600_000) / 60_000);
  const seconds = Math.floor((clamped % 60_000) / 1000);
  const millis = clamped % 1000;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${String(millis).padStart(3, '0')}`;
};

const pad = (value: number) => String(value).padStart(2, '0');
