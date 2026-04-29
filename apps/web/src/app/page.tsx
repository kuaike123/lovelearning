import React from 'react';

import {FeaturedSampleShowcase} from './FeaturedSampleShowcase';
import {RecentJobsPanel} from './RecentJobsPanel';
import {SubmitJobForm} from './SubmitJobForm';
import {SupportedScope} from './SupportedScope';

type HomePageProps = {
  searchParams?: Promise<{
    content?: string;
    style?: 'teacher' | 'kids' | 'exam';
    targetDurationSec?: string;
    taskName?: string;
    voice?: 'female_warm' | 'female_clear' | 'male_calm';
    speechRate?: 'slow' | 'normal' | 'fast';
  }>;
};

const defaultProblem = '\u89e3\u65b9\u7a0b\uff1a2x + 3 = 11';

export default async function HomePage({searchParams}: HomePageProps = {}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialContent = resolvedSearchParams?.content ?? defaultProblem;
  const initialTaskName = resolvedSearchParams?.taskName ?? '';
  const initialTargetDurationSec = parseDuration(resolvedSearchParams?.targetDurationSec);
  const initialStyle = parseStyle(resolvedSearchParams?.style);
  const initialVoice = parseVoice(resolvedSearchParams?.voice);
  const initialSpeechRate = parseSpeechRate(resolvedSearchParams?.speechRate);

  return (
    <main>
      <h1>{'\u6570\u5b66\u8bb2\u89e3\u89c6\u9891\u751f\u6210\u5668'}</h1>
      <FeaturedSampleShowcase />
      <SupportedScope />
      <SubmitJobForm
        initialContent={initialContent}
        initialStyle={initialStyle}
        initialTargetDurationSec={initialTargetDurationSec}
        initialTaskName={initialTaskName}
        initialVoice={initialVoice}
        initialSpeechRate={initialSpeechRate}
      />
      <RecentJobsPanel />
    </main>
  );
}

const parseDuration = (value: string | undefined): 30 | 45 | 60 => {
  if (value === '30' || value === '45' || value === '60') {
    return Number(value) as 30 | 45 | 60;
  }

  return 45;
};

const parseStyle = (value: string | undefined): 'teacher' | 'kids' | 'exam' => {
  if (value === 'teacher' || value === 'kids' || value === 'exam') {
    return value;
  }

  return 'teacher';
};

const parseVoice = (
  value: string | undefined
): 'female_warm' | 'female_clear' | 'male_calm' | undefined => {
  if (value === 'female_warm' || value === 'female_clear' || value === 'male_calm') {
    return value;
  }

  return undefined;
};

const parseSpeechRate = (value: string | undefined): 'slow' | 'normal' | 'fast' | undefined => {
  if (value === 'slow' || value === 'normal' || value === 'fast') {
    return value;
  }

  return undefined;
};
