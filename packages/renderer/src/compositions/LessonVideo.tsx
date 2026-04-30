import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, useCurrentFrame} from 'remotion';

import type {VideoProject} from '../../../shared-types/src';

import {buildTimeline} from '../lib/build-timeline';
import {SceneLayoutRenderer} from '../components/SceneLayoutRenderer';
import {getMotionProfile} from '../lib/scene-motion';
import {getSceneVisuals} from '../lib/scene-visuals';
import {SceneProgress} from '../components/SceneProgress';
import {ShortVideoShell} from '../components/ShortVideoShell';
import {Subtitle} from '../components/Subtitle';

export const LessonVideo: React.FC<{project: VideoProject}> = ({project}) => {
  const timeline = buildTimeline(project.scenes, project.fps);

  return (
    <AbsoluteFill
      style={{
        background: '#F7F3EA',
        color: '#1F2937',
        fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif'
      }}
    >
      {timeline.map((entry, index) => (
        <Sequence key={entry.id} from={entry.from} durationInFrames={entry.durationInFrames}>
          {project.scenes[index]?.audioUrl ? <Audio src={project.scenes[index].audioUrl} /> : null}
          <SceneFrame
            durationInFrames={entry.durationInFrames}
            scene={project.scenes[index]}
            sceneNumber={index + 1}
            totalScenes={project.scenes.length}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const SceneFrame: React.FC<{
  durationInFrames: number;
  scene: VideoProject['scenes'][number] | undefined;
  sceneNumber: number;
  totalScenes: number;
}> = ({durationInFrames, scene, sceneNumber, totalScenes}) => {
  const frame = useCurrentFrame();

  if (!scene) return null;

  const visuals = getSceneVisuals(scene);
  const sceneProgress = durationInFrames > 0 ? frame / durationInFrames : 0;
  const easedIn = interpolate(frame, [0, 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const motion = getMotionProfile(visuals.motionPreset as Parameters<typeof getMotionProfile>[0], sceneProgress);
  const formulaRevealCount = Math.max(
    1,
    Math.min(visuals.formulas.length, Math.ceil(interpolate(sceneProgress, [0.18, 0.62], [1, visuals.formulas.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    })))
  );

  return (
    <AbsoluteFill>
      <ShortVideoShell
        sceneProgress={sceneProgress}
        sceneType={scene.sceneType}
        sceneNumber={sceneNumber}
        totalScenes={totalScenes}
        title={visuals.heading}
      >
        <div
          style={{
            display: 'grid',
            gap: 30,
            opacity: Math.min(1, easedIn * motion.opacity),
            transform: `translate3d(${motion.translateX}px, ${motion.translateY}px, 0) scale(${motion.scale})`
          }}
        >
          <SceneTypePill sceneType={scene.sceneType} layoutLabel={visuals.layoutLabel} />
          <SceneLayoutRenderer
            sceneType={scene.sceneType}
            visuals={{
              ...visuals,
              formulas: visuals.formulas.slice(0, formulaRevealCount)
            }}
          />
          <Subtitle text={visuals.narration} />
          <SceneProgress progress={sceneNumber / totalScenes} />
        </div>
      </ShortVideoShell>
    </AbsoluteFill>
  );
};

const SceneTypePill: React.FC<{layoutLabel?: string; sceneType: string}> = ({layoutLabel, sceneType}) => {
  return (
    <div style={pillStyle}>
      <span>{formatSceneType(sceneType)}</span>
      <strong>{layoutLabel ?? '\u8ddf\u7740\u8001\u5e08\u4e00\u6b65\u4e00\u6b65\u6765'}</strong>
    </div>
  );
};

export const formatSceneType = (sceneType: string) => {
  const labels: Record<string, string> = {
    problem: '\u8bfb\u9898',
    step: '\u8bb2\u89e3',
    summary: '\u603b\u7ed3',
    title: '\u7247\u5934',
    warning: '\u6613\u9519\u63d0\u9192'
  };

  return labels[sceneType] ?? sceneType;
};

const pillStyle = {
  alignItems: 'center',
  background: 'rgba(31, 81, 52, 0.1)',
  border: '2px solid rgba(31, 81, 52, 0.18)',
  borderRadius: 999,
  color: '#1F5134',
  display: 'flex',
  fontSize: 26,
  fontWeight: 900,
  gap: 16,
  justifyContent: 'space-between',
  padding: '14px 20px'
};
