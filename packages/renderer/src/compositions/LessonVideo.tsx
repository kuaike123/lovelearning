import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';

import type {VideoProject} from '../../../shared-types/src';

import {buildTimeline} from '../lib/build-timeline';
import {getSceneVisuals} from '../lib/scene-visuals';

export const LessonVideo: React.FC<{project: VideoProject}> = ({project}) => {
  const timeline = buildTimeline(project.scenes, project.fps);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(160deg, #F7F3EA 0%, #E7F0DA 55%, #D6E7F7 100%)',
        color: '#1F2937',
        fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif'
      }}
    >
      {timeline.map((entry, index) => (
        <Sequence key={entry.id} from={entry.from} durationInFrames={entry.durationInFrames}>
          <SceneFrame scene={project.scenes[index]} sceneNumber={index + 1} totalScenes={project.scenes.length} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const SceneFrame: React.FC<{
  scene: VideoProject['scenes'][number] | undefined;
  sceneNumber: number;
  totalScenes: number;
}> = ({scene, sceneNumber, totalScenes}) => {
  if (!scene) return null;

  const visuals = getSceneVisuals(scene);

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        padding: 96
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          border: '3px solid rgba(31, 41, 55, 0.12)',
          borderRadius: 42,
          boxShadow: '0 28px 80px rgba(31, 41, 55, 0.18)',
          padding: 64,
          width: '100%'
        }}
      >
        <div
          style={{
            color: '#597047',
            fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 3,
            marginBottom: 34,
            textTransform: 'uppercase'
          }}
        >
          {formatSceneType(scene.sceneType)} / {sceneNumber}/{totalScenes}
        </div>
        <h2
          style={{
            fontSize: scene.sceneType === 'title' ? 72 : 46,
            fontWeight: 700,
            lineHeight: 1.18,
            margin: 0
          }}
        >
          {visuals.heading}
        </h2>
        <div
          style={{
            display: 'grid',
            gap: 18,
            marginTop: 42
          }}
        >
          {visuals.formulas.map((formula) => (
            <div
              key={formula}
              style={{
                background: '#102A43',
                borderRadius: 28,
                color: '#FFF7D6',
                fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
                fontSize: formula.length > 28 ? 42 : 58,
                fontWeight: 800,
                letterSpacing: 0.5,
                padding: '28px 34px'
              }}
            >
              {formula}
            </div>
          ))}
        </div>
        {visuals.detail ? (
          <p
            style={{
              color: '#4B5563',
              fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
              fontSize: 28,
              lineHeight: 1.45,
              margin: '34px 0 0'
            }}
          >
            {visuals.detail}
          </p>
        ) : null}
        <p
          style={{
            borderTop: '2px solid rgba(31, 41, 55, 0.12)',
            color: '#1F2937',
            fontFamily: '"Noto Sans SC", "Microsoft YaHei", sans-serif',
            fontSize: 27,
            lineHeight: 1.45,
            margin: '34px 0 0',
            paddingTop: 24
          }}
        >
          {visuals.narration}
        </p>
        <div
          style={{
            backgroundColor: '#F5C542',
            borderRadius: 999,
            height: 14,
            marginTop: 48,
            width: `${Math.max(18, (sceneNumber / totalScenes) * 100)}%`
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const formatSceneType = (sceneType: string) => {
  const labels: Record<string, string> = {
    problem: '读题',
    step: '讲解',
    summary: '总结',
    title: '片头',
    warning: '易错提醒'
  };

  return labels[sceneType] ?? sceneType;
};
