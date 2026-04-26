import {afterEach, describe, expect, it, vi} from 'vitest';

import {createJob, deleteJob, getJob, getLessonPlan, listJobs, regenerateJob} from '../../apps/web/src/lib/api-client';

describe('api client', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates a job through the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({jobId: 'job-1', status: 'queued'})
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await createJob({
      subject: 'math',
      sourceType: 'text',
      content: 'Solve equation: 2x + 3 = 11'
    });

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/jobs', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        subject: 'math',
        sourceType: 'text',
        content: 'Solve equation: 2x + 3 = 11'
      })
    });
    expect(result).toEqual({jobId: 'job-1', status: 'queued'});
  });

  it('creates a job with generation options', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({jobId: 'job-1', status: 'queued'})
    });
    vi.stubGlobal('fetch', fetchMock);

    await createJob({
      subject: 'math',
      grade: 'junior',
      sourceType: 'text',
      taskName: '初一方程例题讲解',
      content: 'Solve equation: 2x + 3 = 11',
      targetDurationSec: 45,
      style: 'teacher',
      voice: 'female_warm'
    });

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/jobs', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        subject: 'math',
        grade: 'junior',
        sourceType: 'text',
        taskName: '初一方程例题讲解',
        content: 'Solve equation: 2x + 3 = 11',
        targetDurationSec: 45,
        style: 'teacher',
        voice: 'female_warm'
      })
    });
  });

  it('loads a job through the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({jobId: 'job-1', status: 'queued'})
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await getJob('job-1');

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/jobs/job-1');
    expect(result).toEqual({jobId: 'job-1', status: 'queued'});
  });

  it('loads recent jobs through the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({jobs: [{jobId: 'job-1', status: 'completed'}]})
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await listJobs();

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/jobs');
    expect(result).toEqual({jobs: [{jobId: 'job-1', status: 'completed'}]});
  });

  it('deletes a job through the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({deleted: true})
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await deleteJob('job-1');

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/jobs/job-1', {
      method: 'DELETE'
    });
    expect(result).toEqual({deleted: true});
  });

  it('regenerates a job through the API', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({jobId: 'job-2', status: 'queued'})
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await regenerateJob('job-1');

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/jobs/job-1/regenerate', {
      method: 'POST'
    });
    expect(result).toEqual({jobId: 'job-2', status: 'queued'});
  });

  it('loads a lesson plan from its artifact URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({title: 'Solve 2x + 3 = 11', steps: []})
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await getLessonPlan('http://localhost:3001/artifacts/jobs/job-1/lesson.json');

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/artifacts/jobs/job-1/lesson.json');
    expect(result).toEqual({title: 'Solve 2x + 3 = 11', steps: []});
  });
});
