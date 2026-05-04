'use client';

import React from 'react';

import {TaskForm} from '../components/TaskForm';
import {createJob} from '../lib/api-client';

type VoiceOption = 'female_warm' | 'female_clear' | 'male_calm';
type SpeechRate = 'slow' | 'normal' | 'fast';

type SubmitJobFormProps = {
  initialContent: string;
  initialGrade?: 'junior';
  initialStyle?: 'teacher' | 'kids' | 'exam';
  initialTargetDurationSec?: 30 | 45 | 60;
  initialTaskName?: string;
  initialVoice?: VoiceOption;
  initialSpeechRate?: SpeechRate;
};

const outputTypeMap: Record<string, 'video' | 'ppt' | 'lesson_plan' | 'exam'> = {
  PPT: 'ppt',
  教案: 'lesson_plan',
  讲解视频: 'video',
  试卷: 'exam'
};

const subjectMap: Record<string, 'math' | 'physics' | 'english' | 'chinese'> = {
  数学: 'math',
  物理: 'physics',
  英语: 'english',
  语文: 'chinese'
};

export function SubmitJobForm({
  initialContent,
  initialGrade = 'junior',
  initialStyle = 'teacher',
  initialTargetDurationSec = 45,
  initialTaskName = '',
  initialVoice = 'female_warm',
  initialSpeechRate = 'normal'
}: SubmitJobFormProps) {
  return (
    <TaskForm
      initialContent={initialContent}
      initialTargetDurationSec={initialTargetDurationSec}
      initialTaskName={initialTaskName}
      onSubmit={async (values) => {
        const job = await createJob({
          content: values.content,
          grade: initialGrade,
          outputType: outputTypeMap[values.outputType] ?? 'video',
          sourceType: 'text',
          speechRate: initialSpeechRate,
          style: initialStyle,
          subject: subjectMap[values.subject] ?? 'math',
          targetDurationSec: values.targetDurationSec,
          ...(values.taskName ? {taskName: values.taskName} : {}),
          voice: initialVoice
        });

        window.location.assign(`/jobs/${job.jobId}`);
      }}
    />
  );
}
