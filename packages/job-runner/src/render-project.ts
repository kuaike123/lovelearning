import {mkdir, mkdtemp, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import type {VideoProject} from '../../shared-types/src';

type RenderProjectOptions = {
  onProgress?: (progress: {
    encodedFrames?: number;
    progress?: number;
    renderedFrames?: number;
    stitchStage?: string;
  }) => void;
  outputDir?: string;
  mode?: 'placeholder' | 'remotion';
  scale?: number;
};

const transparentPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
  'base64'
);

export const renderProject = async (project: VideoProject, options: RenderProjectOptions = {}) => {
  const outputDir = options.outputDir ?? (await mkdtemp(join(tmpdir(), 'edu-video-render-')));
  const videoPath = join(outputDir, 'output.mp4');
  const coverPath = join(outputDir, 'cover.png');

  await mkdir(outputDir, {recursive: true});

  if (getRenderMode(options) === 'placeholder') {
    options.onProgress?.({progress: 0});
    await writeFile(videoPath, buildMvpVideoPlaceholder(project), 'utf8');
    await writeFile(coverPath, transparentPng);
    options.onProgress?.({progress: 1});
  } else {
    await renderWithRemotion(project, {
      coverPath,
      onProgress: options.onProgress,
      outputDir,
      scale: options.scale ?? 0.35,
      videoPath
    });
  }

  return {videoPath, coverPath};
};

const getRenderMode = (options: RenderProjectOptions) => {
  return options.mode ?? (process.env.EDU_RENDER_MODE === 'placeholder' ? 'placeholder' : 'remotion');
};

const renderWithRemotion = async (
  project: VideoProject,
  options: {
    coverPath: string;
    onProgress?: RenderProjectOptions['onProgress'];
    outputDir: string;
    scale: number;
    videoPath: string;
  }
) => {
  const [{bundle}, {renderMedia, renderStill, selectComposition}] = await Promise.all([
    import('@remotion/bundler'),
    import('@remotion/renderer')
  ]);
  const inputProps = {project};
  const serveUrl = await bundle({
    entryPoint: getRemotionEntryPoint(),
    outDir: join(options.outputDir, 'bundle')
  });
  const composition = await selectComposition({
    serveUrl,
    id: project.compositionId,
    inputProps,
    logLevel: 'error'
  });

  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    concurrency: 1,
    inputProps,
    logLevel: 'error',
    outputLocation: options.videoPath,
    onProgress: options.onProgress,
    overwrite: true,
    scale: options.scale
  });

  await renderStill({
    composition,
    serveUrl,
    frame: 0,
    imageFormat: 'png',
    inputProps,
    logLevel: 'error',
    output: options.coverPath,
    overwrite: true,
    scale: options.scale
  });
};

const getRemotionEntryPoint = () => {
  const currentDir = dirname(fileURLToPath(import.meta.url));

  return resolve(currentDir, '..', '..', 'renderer', 'src', 'remotion-entry.tsx');
};

const buildMvpVideoPlaceholder = (project: VideoProject) => {
  const sceneLines = project.scenes.map((scene) => `${scene.sceneType}: ${scene.subtitle}`).join('\n');

  return [
    'EDU_VIDEO_RENDER_PLACEHOLDER',
    `composition=${project.compositionId}`,
    `durationSec=${project.totalDurationSec}`,
    `size=${project.width}x${project.height}`,
    sceneLines
  ].join('\n');
};
