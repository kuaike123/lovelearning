'use client';

import React, {useEffect, useState} from 'react';

import {deleteJob, listJobs, regenerateJob} from '../lib/api-client';
import {createButtonStyle, createCardStyle, createEyebrowStyle, formControlStyle} from './ui-primitives';

type RecentJob = {
  error?: string;
  jobId: string;
  status: string;
  createdAt?: string;
  problemText?: string;
  taskName?: string;
};

export function RecentJobsPanel() {
  const [jobs, setJobs] = useState<RecentJob[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    let active = true;

    listJobs()
      .then((result) => {
        if (!active) return;
        setJobs(result.jobs ?? []);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('failed');
      });

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (jobId: string) => {
    await deleteJob(jobId);
    setJobs((currentJobs) => currentJobs.filter((job) => job.jobId !== jobId));
  };

  const handleRegenerate = async (jobId: string) => {
    const job = await regenerateJob(jobId);
    window.location.assign(`/jobs/${job.jobId}`);
  };

  if (status === 'loading') {
    return <p>{copy.loading}</p>;
  }

  if (status === 'failed') {
    return <p role="alert">{copy.loadFailed}</p>;
  }

  return (
    <section style={sectionStyle}>
      <div>
        <p style={eyebrowStyle}>{copy.historyEyebrow}</p>
        <h2 style={headingStyle}>{copy.recentJobs}</h2>
      </div>
      <label style={searchLabelStyle} htmlFor="recentJobSearch">
        {copy.searchLabel}
        <input
          id="recentJobSearch"
          name="recentJobSearch"
          placeholder={copy.searchPlaceholder}
          value={query}
          onChange={(event: {currentTarget: {value: string}}) => setQuery(event.currentTarget.value)}
          style={searchInputStyle}
        />
      </label>
      <RecentJobsList jobs={filterRecentJobs(jobs, query)} onDelete={handleDelete} onRegenerate={handleRegenerate} />
    </section>
  );
}

export function RecentJobsList({
  jobs,
  onDelete,
  onRegenerate
}: {
  jobs: RecentJob[];
  onDelete?: (jobId: string) => void | Promise<void>;
  onRegenerate?: (jobId: string) => void | Promise<void>;
}) {
  if (jobs.length === 0) {
    return <p>{copy.empty}</p>;
  }

  return (
    <div style={listStyle}>
      {jobs.map((job) => (
        <article key={job.jobId} style={jobCardStyle}>
          <a href={`/jobs/${job.jobId}`} style={jobLinkStyle}>
            <span style={problemStyle}>{job.taskName ?? job.problemText ?? copy.untitled}</span>
            {job.taskName && job.problemText ? <span style={descriptionStyle}>{job.problemText}</span> : null}
            <span style={metaStyle}>
              {formatJobStatus(job.status)}
              {job.createdAt ? ` · ${new Date(job.createdAt).toLocaleString()}` : ''}
            </span>
          </a>
          {job.status === 'failed' && job.error ? (
            <p style={errorStyle}>
              {copy.failedReason}{job.error}
            </p>
          ) : null}
          {onDelete || onRegenerate ? (
            <div style={actionRowStyle}>
              {onRegenerate ? (
                <button type="button" onClick={() => void onRegenerate(job.jobId)} style={regenerateButtonStyle}>
                  {copy.regenerateJob}
                </button>
              ) : null}
              {onDelete ? (
                <button type="button" onClick={() => void onDelete(job.jobId)} style={deleteButtonStyle}>
                  {copy.deleteJob}
                </button>
              ) : null}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

export const filterRecentJobs = (jobs: RecentJob[], query: string) => {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) return jobs;

  return jobs.filter((job) => {
    return [job.taskName, job.problemText, job.status]
      .filter((value): value is string => typeof value === 'string')
      .some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
  });
};

const formatJobStatus = (status: string) => {
  const labels: Record<string, string> = {
    completed: copy.completed,
    failed: copy.failed,
    loading: copy.loadingStatus,
    queued: copy.queued,
    running: copy.running
  };

  return labels[status] ?? status;
};

const copy = {
  completed: '\u5df2\u5b8c\u6210',
  deleteJob: '\u5220\u9664\u4efb\u52a1',
  empty: '\u8fd8\u6ca1\u6709\u751f\u6210\u8bb0\u5f55\u3002\u63d0\u4ea4\u4e00\u9053\u9898\u540e\uff0c\u53ef\u4ee5\u5728\u8fd9\u91cc\u67e5\u770b\u7ed3\u679c\u3002',
  failed: '\u5931\u8d25',
  failedReason: '\u5931\u8d25\u539f\u56e0\uff1a',
  historyEyebrow: '\u751f\u6210\u8bb0\u5f55',
  loadFailed: '\u6700\u8fd1\u4efb\u52a1\u52a0\u8f7d\u5931\u8d25',
  loading: '\u6b63\u5728\u52a0\u8f7d\u6700\u8fd1\u4efb\u52a1...',
  loadingStatus: '\u52a0\u8f7d\u4e2d',
  queued: '\u6392\u961f\u4e2d',
  recentJobs: '\u6700\u8fd1\u4efb\u52a1',
  regenerateJob: '\u91cd\u65b0\u751f\u6210',
  running: '\u751f\u6210\u4e2d',
  searchLabel: '\u641c\u7d22\u4efb\u52a1',
  searchPlaceholder: '\u8f93\u5165\u4efb\u52a1\u540d\u79f0\u6216\u9898\u76ee\u5173\u952e\u8bcd',
  untitled: '\u672a\u547d\u540d\u6570\u5b66\u9898'
};

const sectionStyle = {
  ...createCardStyle(),
  borderRadius: 24,
  marginTop: 32,
  padding: 24
};

const eyebrowStyle = {
  ...createEyebrowStyle(),
  fontWeight: 700,
  letterSpacing: 1.6,
  textTransform: 'uppercase' as const
};

const headingStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 32,
  lineHeight: 1.1,
  margin: '8px 0 18px'
};

const searchLabelStyle = {
  display: 'grid',
  gap: 8,
  marginBottom: 18
};

const searchInputStyle = {
  ...formControlStyle,
  borderRadius: 12,
  fontSize: 16,
  padding: '10px 12px'
};

const listStyle = {
  display: 'grid',
  gap: 12
};

const jobCardStyle = {
  ...createCardStyle(),
  background: '#ffffff',
  borderRadius: 18,
  color: '#1f2937',
  gap: 10,
  padding: 16
};

const jobLinkStyle = {
  color: '#1f2937',
  display: 'grid',
  gap: 8,
  textDecoration: 'none'
};

const problemStyle = {
  fontSize: 18,
  fontWeight: 700
};

const descriptionStyle = {
  color: '#374151',
  fontSize: 15
};

const metaStyle = {
  color: '#6b7280',
  fontSize: 14
};

const errorStyle = {
  background: '#fff1f2',
  border: '1px solid #fecdd3',
  borderRadius: 12,
  color: '#9f1239',
  margin: 0,
  padding: '10px 12px'
};

const actionRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8
};

const regenerateButtonStyle = {
  ...createButtonStyle({tone: 'primary'}),
  background: '#1f5134',
  border: '1px solid #1f5134',
  justifySelf: 'start',
  padding: '8px 14px'
};

const deleteButtonStyle = {
  ...createButtonStyle({tone: 'primary'}),
  background: '#7f1d1d',
  border: '1px solid #7f1d1d',
  justifySelf: 'start',
  padding: '8px 14px'
};
