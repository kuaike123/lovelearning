'use client';

import React, {useEffect, useState} from 'react';

import {listJobs} from '../lib/api-client';

type RecentJob = {
  jobId: string;
  status: string;
  createdAt?: string;
  problemText?: string;
  taskName?: string;
};

export function RecentJobsPanel() {
  const [jobs, setJobs] = useState<RecentJob[]>([]);
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

  if (status === 'loading') {
    return <p>正在加载最近任务...</p>;
  }

  if (status === 'failed') {
    return <p role="alert">最近任务加载失败</p>;
  }

  return <RecentJobsList jobs={jobs} />;
}

export function RecentJobsList({jobs}: {jobs: RecentJob[]}) {
  return (
    <section style={sectionStyle}>
      <div>
        <p style={eyebrowStyle}>生成记录</p>
        <h2 style={headingStyle}>最近任务</h2>
      </div>
      {jobs.length === 0 ? (
        <p>还没有生成记录。提交一道题后，可以在这里查看结果。</p>
      ) : (
        <div style={listStyle}>
          {jobs.map((job) => (
            <a key={job.jobId} href={`/jobs/${job.jobId}`} style={jobCardStyle}>
              <span style={problemStyle}>{job.taskName ?? job.problemText ?? '未命名数学题'}</span>
              {job.taskName && job.problemText ? <span style={descriptionStyle}>{job.problemText}</span> : null}
              <span style={metaStyle}>
                {formatJobStatus(job.status)}
                {job.createdAt ? ` · ${new Date(job.createdAt).toLocaleString()}` : ''}
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

const formatJobStatus = (status: string) => {
  const labels: Record<string, string> = {
    completed: '已完成',
    failed: '失败',
    loading: '加载中',
    queued: '排队中',
    running: '生成中'
  };

  return labels[status] ?? status;
};

const sectionStyle = {
  background: '#fffaf1',
  border: '1px solid #eadfca',
  borderRadius: 24,
  marginTop: 32,
  padding: 24
};

const eyebrowStyle = {
  color: '#6f7d45',
  fontSize: 13,
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

const listStyle = {
  display: 'grid',
  gap: 12
};

const jobCardStyle = {
  background: '#ffffff',
  border: '1px solid #eadfca',
  borderRadius: 18,
  color: '#1f2937',
  display: 'grid',
  gap: 8,
  padding: 16,
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
