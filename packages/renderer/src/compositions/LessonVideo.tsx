import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';

import type {VideoProject} from '../../../shared-types/src';

import {buildTimeline} from '../lib/build-timeline';
import {FormulaBoard} from '../components/FormulaBoard';
import {getSceneVisuals} from '../lib/scene-visuals';
import {SceneProgress} from '../components/SceneProgress';
import {ShortVideoShell} from '../components/ShortVideoShell';

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
  const lift = interpolate(easedIn, [0, 1], [34, 0]);
  const formulaRevealCount = Math.max(
    1,
    Math.min(visuals.formulas.length, Math.ceil(interpolate(sceneProgress, [0.18, 0.62], [1, visuals.formulas.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    })))
  );

  return (
    <AbsoluteFill>
      <ShortVideoShell sceneType={scene.sceneType} sceneNumber={sceneNumber} totalScenes={totalScenes} title={visuals.heading}>
        <div
          style={{
            display: 'grid',
            gap: 30,
            opacity: easedIn,
            transform: `translateY(${lift}px)`
          }}
        >
          <SceneTypePill sceneType={scene.sceneType} layoutLabel={visuals.layoutLabel} />
          <FormulaBoard formulas={visuals.formulas.slice(0, formulaRevealCount)} sceneType={scene.sceneType} />
          {visuals.detail ? <TeachingNote text={visuals.detail} /> : null}
          <NarrationCard narration={visuals.narration} />
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

const TeachingNote: React.FC<{text: string}> = ({text}) => {
  return (
    <div style={noteStyle}>
      <strong>{'\u753b\u9762\u91cd\u70b9'}</strong>
      <span>{text}</span>
    </div>
  );
};

const NarrationCard: React.FC<{narration: string}> = ({narration}) => {
  return (
    <p style={narrationStyle}>
      <span style={quoteStyle}>{'\u8bb2'}</span>
      {narration}
    </p>
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

const noteStyle = {
  background: '#FFF7D6',
  border: '2px solid rgba(245, 197, 66, 0.55)',
  borderRadius: 24,
  color: '#374151',
  display: 'grid',
  fontSize: 28,
  gap: 10,
  lineHeight: 1.45,
  padding: 24
};

const narrationStyle = {
  alignItems: 'flex-start',
  background: '#FFFFFF',
  border: '2px solid rgba(16, 42, 67, 0.1)',
  borderRadius: 28,
  color: '#1F2937',
  display: 'flex',
  fontSize: 30,
  gap: 18,
  lineHeight: 1.46,
  margin: 0,
  padding: 26
};

const quoteStyle = {
  alignItems: 'center',
  background: '#52B788',
  borderRadius: '50%',
  color: '#ffffff',
  display: 'inline-flex',
  flex: '0 0 auto',
  fontSize: 24,
  fontWeight: 900,
  height: 44,
  justifyContent: 'center',
  width: 44
};
