import type {ProblemInput} from '../../../../packages/shared-types/src';

const apiBaseUrl = 'http://localhost:3001';

export const createJob = async (input: ProblemInput) => {
  const response = await fetch(`${apiBaseUrl}/jobs`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error('Failed to create job');
  }

  return response.json();
};

export const getJob = async (jobId: string) => {
  const response = await fetch(`${apiBaseUrl}/jobs/${jobId}`);

  if (!response.ok) {
    throw new Error('Failed to load job');
  }

  return response.json();
};

export const listJobs = async () => {
  const response = await fetch(`${apiBaseUrl}/jobs`);

  if (!response.ok) {
    throw new Error('Failed to load jobs');
  }

  return response.json();
};

export const deleteJob = async (jobId: string) => {
  const response = await fetch(`${apiBaseUrl}/jobs/${jobId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Failed to delete job');
  }

  return response.json();
};

export const regenerateJob = async (jobId: string) => {
  const response = await fetch(`${apiBaseUrl}/jobs/${jobId}/regenerate`, {
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error('Failed to regenerate job');
  }

  return response.json();
};

export const getLessonPlan = async (lessonPlanUrl: string) => {
  const response = await fetch(lessonPlanUrl);

  if (!response.ok) {
    throw new Error('Failed to load lesson plan');
  }

  return response.json();
};

export const previewTts = async (input: {
  text: string;
  voice?: 'female_warm' | 'female_clear' | 'male_calm';
  speechRate?: 'slow' | 'normal' | 'fast';
}) => {
  const response = await fetch(`${apiBaseUrl}/tts/preview`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error('Failed to preview tts');
  }

  return response.json();
};
