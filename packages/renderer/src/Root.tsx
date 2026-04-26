import React from 'react';
import {Composition} from 'remotion';

import type {VideoProject} from '../../shared-types/src';

import {LessonVideo} from './compositions/LessonVideo';

const defaultProject: VideoProject = {
  compositionId: 'LessonVideo',
  fps: 30,
  width: 1080,
  height: 1920,
  theme: 'clean_classroom',
  totalDurationSec: 3,
  scenes: [
    {
      id: 'title',
      sceneType: 'title',
      durationSec: 3,
      subtitle: 'Lesson Video',
      transition: 'fade',
      props: {}
    }
  ]
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LessonVideo"
      component={LessonVideo}
      durationInFrames={Math.ceil(defaultProject.totalDurationSec * defaultProject.fps)}
      fps={defaultProject.fps}
      width={defaultProject.width}
      height={defaultProject.height}
      defaultProps={{project: defaultProject}}
      calculateMetadata={({props}) => {
        const project = (props?.project ?? defaultProject) as VideoProject;

        return {
          durationInFrames: Math.ceil(project.totalDurationSec * project.fps),
          fps: project.fps,
          width: project.width,
          height: project.height
        };
      }}
    />
  );
};
