import type {ProblemInput} from '../../../../packages/shared-types/src';

const DEFAULT_LOCAL_API_PORT = '3001';

export const getApiBaseUrl = () => {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const {hostname, protocol} = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:${DEFAULT_LOCAL_API_PORT}`;
    }
  }

  return `http://localhost:${DEFAULT_LOCAL_API_PORT}`;
};

const requestJson = async (input: string, init?: RequestInit) => {
  try {
    const response = init ? await fetch(input, init) : await fetch(input);

    if (!response.ok) {
      throw new Error(await readApiErrorMessage(response));
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message) {
      if (error.message === 'Failed to fetch' || error.message === 'fetch failed') {
        throw new Error('API_UNREACHABLE');
      }

      throw error;
    }

    throw new Error('API_UNREACHABLE');
  }
};

const readApiErrorMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as {message?: unknown};

    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
  } catch {
    // Ignore non-JSON errors and fall back to a generic message below.
  }

  return `API_${response.status}`;
};

export const createJob = async (input: ProblemInput) => {
  return requestJson(`${getApiBaseUrl()}/jobs`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(input)
  });
};

export const getJob = async (jobId: string) => {
  return requestJson(`${getApiBaseUrl()}/jobs/${jobId}`);
};

export const listJobs = async () => {
  return requestJson(`${getApiBaseUrl()}/jobs`);
};

export const deleteJob = async (jobId: string) => {
  return requestJson(`${getApiBaseUrl()}/jobs/${jobId}`, {
    method: 'DELETE'
  });
};

export const regenerateJob = async (jobId: string) => {
  return requestJson(`${getApiBaseUrl()}/jobs/${jobId}/regenerate`, {
    method: 'POST'
  });
};

export const getLessonPlan = async (lessonPlanUrl: string) => {
  return requestJson(lessonPlanUrl);
};

export const previewTts = async (input: {
  text: string;
  style?: 'teacher' | 'kids' | 'exam';
  targetDurationSec?: 30 | 45 | 60;
  voice?: 'female_warm' | 'female_clear' | 'male_calm';
  speechRate?: 'slow' | 'normal' | 'fast';
}) => {
  return requestJson(`${getApiBaseUrl()}/tts/preview`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(input)
  });
};
