'use client';

import React, {useEffect, useState} from 'react';

import {deleteJob, listJobs, regenerateJob} from '../lib/api-client';
import {createButtonStyle, createCardStyle, createEyebrowStyle, formControlStyle} from './ui-primitives';

type RecentJob = {
  error?: string;
  jobId: string;
  status: string;
  stage?: string;
  progress?: number;
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

  const insights = summarizeRecentJobs(jobs);

  return (
    <div style={listStyle}>
      <section style={overviewPanelStyle}>
        <div style={overviewHeaderStyle}>
          <div>
            <p style={overviewEyebrowStyle}>{copy.overviewEyebrow}</p>
            <h3 style={overviewTitleStyle}>{copy.overviewTitle}</h3>
          </div>
          <span style={overviewHintStyle}>{copy.overviewHint}</span>
        </div>
        <div style={overviewGridStyle}>
          <article style={overviewCardStyle}>
            <span style={overviewLabelStyle}>{copy.overviewTotal}</span>
            <strong style={overviewValueStyle}>{insights.total}</strong>
          </article>
          <article style={overviewCardStyle}>
            <span style={overviewLabelStyle}>{copy.overviewRunning}</span>
            <strong style={overviewValueStyle}>{insights.inFlight}</strong>
          </article>
          <article style={overviewCardStyle}>
            <span style={overviewLabelStyle}>{copy.overviewCompleted}</span>
            <strong style={overviewValueStyle}>{insights.completed}</strong>
          </article>
          <article style={overviewCardStyle}>
            <span style={overviewLabelStyle}>{copy.overviewFailed}</span>
            <strong style={overviewValueStyle}>{insights.failed}</strong>
          </article>
        </div>
      </section>

      {insights.failed > 0 ? (
        <section style={attentionCardStyle}>
          <div style={attentionHeaderStyle}>
            <strong style={attentionTitleStyle}>{copy.needsAttentionTitle}</strong>
            <span style={attentionCountStyle}>{`${insights.failed}${copy.needsAttentionCountSuffix}`}</span>
          </div>
          <p style={attentionBodyStyle}>{copy.needsAttentionBody}</p>
        </section>
      ) : null}

      {jobs.map((job) => {
        const progress = typeof job.progress === 'number' ? clampProgress(job.progress) : null;

        return (
          <article key={job.jobId} style={jobCardStyle}>
            <a href={`/jobs/${job.jobId}`} style={jobLinkStyle}>
              <div style={cardTopRowStyle}>
                <span style={problemStyle}>{job.taskName ?? job.problemText ?? copy.untitled}</span>
                <span style={getStatusBadgeStyle(job.status)}>{formatJobStatus(job.status)}</span>
              </div>
              {job.taskName && job.problemText ? <span style={descriptionStyle}>{job.problemText}</span> : null}
              <span style={metaStyle}>
                {job.createdAt ? `${copy.createdAtPrefix}${new Date(job.createdAt).toLocaleString()}` : formatJobStatus(job.status)}
              </span>
            </a>

            {job.status !== 'failed' && (job.stage || progress !== null) ? (
              <div style={timelineCardStyle}>
                {job.stage ? (
                  <p style={timelineTextStyle}>
                    {copy.currentStagePrefix}
                    {formatJobStage(job.stage)}
                  </p>
                ) : null}
                {progress !== null ? (
                  <>
                    <div aria-label={copy.progressBarLabel} style={progressTrackStyle}>
                      <div style={{...progressFillStyle, width: `${progress}%`}} />
                    </div>
                    <p style={progressTextStyle}>{`${copy.progressTextPrefix} ${progress}%`}</p>
                  </>
                ) : null}
              </div>
            ) : null}

            {job.status === 'failed' && job.error ? (
              <p style={errorStyle}>
                {copy.failedReason}
                {job.error}
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
        );
      })}
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

const summarizeRecentJobs = (jobs: RecentJob[]) => {
  return jobs.reduce(
    (summary, job) => {
      summary.total += 1;

      if (job.status === 'completed') {
        summary.completed += 1;
      } else if (job.status === 'failed') {
        summary.failed += 1;
      } else {
        summary.inFlight += 1;
      }

      return summary;
    },
    {
      completed: 0,
      failed: 0,
      inFlight: 0,
      total: 0
    }
  );
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

const formatJobStage = (stage: string) => {
  const labels: Record<string, string> = {
    audio: copy.stageAudio,
    done: copy.stageDone,
    job_runner: copy.stageJobRunner,
    loading: copy.loadingStatus,
    map: copy.stageMap,
    parse: copy.stageParse,
    plan: copy.stagePlan,
    queued: copy.queued,
    render: copy.stageRender,
    store: copy.stageStore,
    subtitles: copy.stageSubtitles
  };

  return labels[stage] ?? stage;
};

const clampProgress = (progress: number) => Math.max(0, Math.min(100, Math.round(progress)));

const getStatusBadgeStyle = (status: string) => ({
  ...statusBadgeStyle,
  ...(status === 'completed'
    ? statusBadgeCompletedStyle
    : status === 'failed'
      ? statusBadgeFailedStyle
      : statusBadgeInFlightStyle)
});

const copy = {
  completed: '已完成',
  createdAtPrefix: '创建时间：',
  currentStagePrefix: '当前阶段：',
  deleteJob: '删除任务',
  empty: '还没有生成记录。提交一道题后，可以在这里查看结果。',
  failed: '失败',
  failedReason: '失败原因：',
  historyEyebrow: '生成记录',
  loadFailed: '最近任务加载失败',
  loading: '正在加载最近任务...',
  loadingStatus: '加载中',
  needsAttentionBody: '请优先检查失败任务，可以直接重新生成或删除无效记录。',
  needsAttentionCountSuffix: '个待处理',
  needsAttentionTitle: '需要处理',
  overviewCompleted: '已完成',
  overviewEyebrow: '任务总览',
  overviewFailed: '待处理',
  overviewHint: '先看状态，再继续回看或处理',
  overviewRunning: '正在生成',
  overviewTitle: '本批任务看板',
  overviewTotal: '全部任务',
  progressBarLabel: '生成进度',
  progressTextPrefix: '进度',
  queued: '排队中',
  recentJobs: '最近任务',
  regenerateJob: '重新生成',
  running: '生成中',
  searchLabel: '搜索任务',
  searchPlaceholder: '输入任务名称或题目关键词',
  stageAudio: '生成配音',
  stageDone: '完成',
  stageJobRunner: '执行任务',
  stageMap: '生成分镜',
  stageParse: '解析题目',
  stagePlan: '规划讲解',
  stageRender: '渲染视频',
  stageStore: '保存成片',
  stageSubtitles: '生成字幕',
  untitled: '未命名数学题'
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

const overviewPanelStyle = {
  background: 'linear-gradient(135deg, #fffaf1 0%, #f6efdd 100%)',
  border: '1px solid #eadfca',
  borderRadius: 20,
  display: 'grid',
  gap: 14,
  padding: 18
};

const overviewHeaderStyle = {
  alignItems: 'end',
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 10,
  justifyContent: 'space-between'
};

const overviewEyebrowStyle = {
  color: '#6f7d45',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.2,
  margin: 0
};

const overviewTitleStyle = {
  fontSize: 24,
  lineHeight: 1.2,
  margin: '6px 0 0'
};

const overviewHintStyle = {
  color: '#6b7280',
  fontSize: 13,
  fontWeight: 700
};

const overviewGridStyle = {
  display: 'grid',
  gap: 10,
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'
};

const overviewCardStyle = {
  background: '#ffffff',
  border: '1px solid #eadfca',
  borderRadius: 16,
  display: 'grid',
  gap: 6,
  padding: '12px 14px'
};

const overviewLabelStyle = {
  color: '#7c4a03',
  fontSize: 12,
  fontWeight: 700
};

const overviewValueStyle = {
  color: '#102A43',
  fontSize: 24,
  lineHeight: 1.2
};

const attentionCardStyle = {
  background: '#fff1f2',
  border: '1px solid #fecdd3',
  borderRadius: 18,
  display: 'grid',
  gap: 8,
  padding: 16
};

const attentionHeaderStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: 10,
  justifyContent: 'space-between'
};

const attentionTitleStyle = {
  color: '#9f1239',
  fontSize: 16,
  fontWeight: 800
};

const attentionCountStyle = {
  background: '#ffe4e6',
  borderRadius: 999,
  color: '#9f1239',
  fontSize: 12,
  fontWeight: 800,
  padding: '6px 10px'
};

const attentionBodyStyle = {
  color: '#881337',
  lineHeight: 1.6,
  margin: 0
};

const jobCardStyle = {
  ...createCardStyle(),
  background: '#ffffff',
  borderRadius: 18,
  color: '#1f2937',
  gap: 10,
  padding: 16
};

const cardTopRowStyle = {
  alignItems: 'start',
  display: 'flex',
  gap: 10,
  justifyContent: 'space-between'
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

const statusBadgeStyle = {
  borderRadius: 999,
  display: 'inline-flex',
  flexShrink: 0,
  fontSize: 12,
  fontWeight: 800,
  padding: '6px 10px'
};

const statusBadgeCompletedStyle = {
  background: '#e7f0da',
  color: '#1f5134'
};

const statusBadgeFailedStyle = {
  background: '#ffe4e6',
  color: '#9f1239'
};

const statusBadgeInFlightStyle = {
  background: '#fff4cc',
  color: '#7c4a03'
};

const timelineCardStyle = {
  background: '#f8fafc',
  border: '1px solid #e5e7eb',
  borderRadius: 14,
  display: 'grid',
  gap: 8,
  padding: '12px 14px'
};

const timelineTextStyle = {
  color: '#374151',
  fontSize: 14,
  fontWeight: 700,
  margin: 0
};

const progressTrackStyle = {
  background: '#e5e7eb',
  borderRadius: 999,
  height: 10,
  overflow: 'hidden'
};

const progressFillStyle = {
  background: 'linear-gradient(90deg, #1f5134 0%, #6f7d45 100%)',
  height: '100%'
};

const progressTextStyle = {
  color: '#6b7280',
  fontSize: 13,
  fontWeight: 700,
  margin: 0
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
