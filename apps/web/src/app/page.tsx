import React from 'react';

import {getProblemTemplates} from '../../../../packages/lesson-engine/src/problem-templates';
import {ChatLandingPage} from './ChatLandingPage';
import {featuredSamples, getFeaturedSampleBySlug} from './featured-samples';

type HomePageProps = {
  searchParams?: Promise<{
    content?: string;
    speechRate?: 'slow' | 'normal' | 'fast';
    style?: 'teacher' | 'kids' | 'exam';
    targetDurationSec?: string;
    view?: 'create' | 'jobs' | 'samples' | 'materials' | 'roadmap';
    sampleStyle?: string;
    voice?: 'female_warm' | 'female_clear' | 'male_calm';
  }>;
};

const defaultProblem = '';

export default async function HomePage({searchParams}: HomePageProps = {}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedSample = resolvedSearchParams?.sampleStyle
    ? getFeaturedSampleBySlug(resolvedSearchParams.sampleStyle)
    : null;

  return (
    <ChatLandingPage
      examplePrompts={getProblemTemplates().flatMap((template) => template.examples)}
      initialContent={resolvedSearchParams?.content ?? selectedSample?.content ?? defaultProblem}
      initialSpeechRate={parseSpeechRate(resolvedSearchParams?.speechRate) ?? selectedSample?.speechRate}
      initialStyle={parseStyle(resolvedSearchParams?.style) ?? selectedSample?.style ?? 'teacher'}
      initialTargetDurationSec={
        parseDuration(resolvedSearchParams?.targetDurationSec) ?? selectedSample?.targetDurationSec ?? 45
      }
      initialView={parseView(resolvedSearchParams?.view)}
      initialVideoStyle={selectedSample?.slug ?? 'custom'}
      initialVoice={parseVoice(resolvedSearchParams?.voice) ?? selectedSample?.voice}
      sampleStyles={featuredSamples.map((sample) => ({
        content: sample.content,
        slug: sample.slug,
        speechRate: sample.speechRate,
        style: sample.style,
        targetDurationSec: sample.targetDurationSec,
        taskName: sample.taskName,
        title: sample.title,
        voice: sample.voice
      }))}
    />
  );
}

const parseDuration = (value: string | undefined): 30 | 45 | 60 | undefined => {
  if (value === '30' || value === '45' || value === '60') {
    return Number(value) as 30 | 45 | 60;
  }

  return undefined;
};

const parseStyle = (value: string | undefined): 'teacher' | 'kids' | 'exam' | undefined => {
  if (value === 'teacher' || value === 'kids' || value === 'exam') {
    return value;
  }

  return undefined;
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

const parseView = (
  value: string | undefined
): 'create' | 'jobs' | 'samples' | 'materials' | 'roadmap' => {
  if (
    value === 'create' ||
    value === 'jobs' ||
    value === 'samples' ||
    value === 'materials' ||
    value === 'roadmap'
  ) {
    return value;
  }

  return 'create';
};
