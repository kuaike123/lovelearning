'use client';

import React, {useEffect, useState} from 'react';

import {getJob, getLessonPlan, regenerateJob} from '../../../lib/api-client';

type Job = {
  jobId: string;
  status: string;
  stage?: string;
  progress?: number;
  error?: string;
  taskName?: string;
  videoUrl?: string;
  coverUrl?: string;
  subtitleUrl?: string;
  lessonPlanUrl?: string;
};

type LessonPlan = {
  title: string;
  learningGoal?: string;
  summary?: string;
  steps?: {
    id: string;
    teachingGoal?: string;
    narration: string;
    visualIntent?: string;
    keyText?: string[];
  }[];
};

const copy = {
  actionsHome: '\u8fd4\u56de\u9996\u9875',
  actionsRegenerate: '\u91cd\u65b0\u751f\u6210',
  assetCover: '\u5c01\u9762',
  assetDownloadTitle: '\u4e0b\u8f7d\u6587\u4ef6',
  assetJson: '\u8bb2\u89e3 JSON',
  assetSubtitle: '\u5b57\u5e55',
  assetVideo: '\u89c6\u9891',
  coverAlt: '\u751f\u6210\u7684\u8bb2\u89e3\u89c6\u9891\u5c01\u9762',
  errorDefault: '\u4efb\u52a1\u751f\u6210\u5931\u8d25',
  errorLoad: '\u4efb\u52a1\u52a0\u8f7d\u5931\u8d25',
  errorParser:
    '\u5f53\u524d\u7248\u672c\u4ec5\u652f\u6301\u4e00\u5143\u4e00\u6b21\u65b9\u7a0b\u89e3\u6790\uff0c\u8bf7\u8f93\u5165\u7c7b\u4f3c\u201c\u89e3\u65b9\u7a0b\uff1a2x + 3 = 11\u201d\u7684\u9898\u76ee\u3002',
  errorPrefix: '\u9519\u8bef\uff1a',
  fieldJobId: '\u4efb\u52a1 ID\uff1a',
  fieldTaskName: '\u4efb\u52a1\u540d\u79f0\uff1a',
  generatedNotice: '\u89c6\u9891\u6b63\u5728\u751f\u6210\u4e2d\uff0c\u672c\u9875\u9762\u4f1a\u81ea\u52a8\u5237\u65b0\u3002',
  lessonOutline: '\u8bb2\u89e3\u5927\u7eb2',
  loadingProgress: '\u751f\u6210\u8fdb\u5ea6',
  mainEyebrow: '\u89c6\u9891\u751f\u6210\u4efb\u52a1',
  mainTitle: '\u6570\u5b66\u8bb2\u89e3\u89c6\u9891\u9884\u89c8',
  stagePrefix: '\u9636\u6bb5\uff1a',
  statusPrefix: '\u72b6\u6001\uff1a',
  progressPrefix: '\u8fdb\u5ea6\uff1a',
  summaryPrefix: '\u603b\u7ed3\uff1a',
  unnamedTask: '\u672a\u547d\u540d\u4efb\u52a1',
  visualIntentPrefix: '\u753b\u9762\u8bbe\u8ba1\uff1a',
  learningGoalPrefix: '\u5b66\u4e60\u76ee\u6807\uff1a'
};

export function JobResultPanel({jobId}: {jobId: string}) {
  const [job, setJob] = useState<Job | null>(null);
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const loadJob = async () => {
      try {
        const nextJob = await getJob(jobId);

        if (!active) return;

        setJob(nextJob);
        setError(null);

        if (!isTerminalJobStatus(nextJob.status)) {
          timeoutId = setTimeout(loadJob, 3000);
        }
      } catch {
        if (active) setError(copy.errorLoad);
      }
    };

    void loadJob();

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [jobId]);

  useEffect(() => {
    let active = true;

    const loadLessonPlan = async () => {
      if (job?.status !== 'completed' || !job.lessonPlanUrl) {
        setLessonPlan(null);
        return;
      }

      try {
        const nextLessonPlan = await getLessonPlan(job.lessonPlanUrl);
        if (active) setLessonPlan(nextLessonPlan);
      } catch {
        if (active) setLessonPlan(null);
      }
    };

    void loadLessonPlan();

    return () => {
      active = false;
    };
  }, [job?.lessonPlanUrl, job?.status]);

  const handleRegenerate = async () => {
    const nextJob = await regenerateJob(jobId);
    window.location.assign(`/jobs/${nextJob.jobId}`);
  };

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section style={panelStyle}>
      <p style={eyebrowStyle}>{copy.mainEyebrow}</p>
      <h1 style={titleStyle}>{copy.mainTitle}</h1>
      <p>
        {copy.fieldTaskName}
        {job?.taskName ?? copy.unnamedTask}
      </p>
      <p style={mutedTextStyle}>
        {copy.fieldJobId}
        {jobId}
      </p>
      <JobResultActions jobId={jobId} onRegenerate={handleRegenerate} />
      <JobStatusSummary job={job ?? {jobId, status: 'loading'}} />
      {job && !isTerminalJobStatus(job.status) ? <p aria-live="polite">{copy.generatedNotice}</p> : null}
      {job?.status === 'failed' ? <p role="alert">{formatJobError(job.error)}</p> : null}
      {job ? <JobAssetList job={job} /> : null}
      {lessonPlan ? <LessonPlanSummary lessonPlan={lessonPlan} /> : null}
    </section>
  );
}

export function JobResultActions({
  jobId,
  onRegenerate
}: {
  jobId: string;
  onRegenerate: (jobId: string) => void | Promise<void>;
}) {
  return (
    <div style={actionsStyle}>
      <a href="/" style={homeLinkStyle}>
        {copy.actionsHome}
      </a>
      <button type="button" onClick={() => void onRegenerate(jobId)} style={regenerateButtonStyle}>
        {copy.actionsRegenerate}
      </button>
    </div>
  );
}

export function JobStatusSummary({job}: {job: Pick<Job, 'error' | 'progress' | 'status' | 'stage' | 'taskName'>}) {
  const progress = typeof job.progress === 'number' ? Math.max(0, Math.min(100, Math.round(job.progress))) : null;

  return (
    <>
      <div style={statusGridStyle}>
        {job.taskName ? (
          <p>
            {copy.fieldTaskName}
            {job.taskName}
          </p>
        ) : null}
        <p>
          {copy.statusPrefix}
          {formatJobStatus(job.status)}
        </p>
        {job.stage ? (
          <p>
            {copy.stagePrefix}
            {formatJobStage(job.stage)}
          </p>
        ) : null}
        {progress !== null ? (
          <p>
            {copy.progressPrefix}
            {progress}%
          </p>
        ) : null}
        {job.status === 'failed' ? (
          <p>
            {copy.errorPrefix}
            {formatJobError(job.error)}
          </p>
        ) : null}
      </div>
      {progress !== null ? (
        <div
          aria-label={copy.loadingProgress}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          role="progressbar"
          style={progressTrackStyle}
        >
          <div style={{...progressFillStyle, width: `${progress}%`}} />
        </div>
      ) : null}
    </>
  );
}

export function JobAssetList({job}: {job: Job}) {
  if (job.status !== 'completed') {
    return null;
  }

  return (
    <div style={assetGridStyle}>
      <div style={previewCardStyle}>
        {job.videoUrl ? (
          <video controls poster={job.coverUrl} src={job.videoUrl} style={videoStyle}>
            <a href={job.videoUrl}>{copy.assetVideo}</a>
          </video>
        ) : null}
        {job.coverUrl ? <img alt={copy.coverAlt} src={job.coverUrl} style={coverStyle} /> : null}
      </div>
      <div style={linkCardStyle}>
        <p style={eyebrowStyle}>{copy.assetDownloadTitle}</p>
        {job.videoUrl ? <a href={job.videoUrl}>{copy.assetVideo}</a> : null}
        {job.coverUrl ? <a href={job.coverUrl}>{copy.assetCover}</a> : null}
        {job.subtitleUrl ? <a href={job.subtitleUrl}>{copy.assetSubtitle}</a> : null}
        {job.lessonPlanUrl ? <a href={job.lessonPlanUrl}>{copy.assetJson}</a> : null}
      </div>
    </div>
  );
}

export function LessonPlanSummary({lessonPlan}: {lessonPlan: LessonPlan}) {
  return (
    <section style={lessonPanelStyle}>
      <p style={eyebrowStyle}>{copy.lessonOutline}</p>
      <h2 style={lessonTitleStyle}>{lessonPlan.title}</h2>
      {lessonPlan.learningGoal ? (
        <p>
          {copy.learningGoalPrefix}
          {lessonPlan.learningGoal}
        </p>
      ) : null}
      {lessonPlan.steps?.length ? (
        <ol style={stepListStyle}>
          {lessonPlan.steps.map((step, index) => (
            <li key={step.id} style={stepCardStyle}>
              <h3 style={stepTitleStyle}>
                {index + 1}. {step.teachingGoal ?? step.id}
              </h3>
              <p>{step.narration}</p>
              {step.visualIntent ? (
                <p style={mutedTextStyle}>
                  {copy.visualIntentPrefix}
                  {step.visualIntent}
                </p>
              ) : null}
              {step.keyText?.length ? (
                <div style={keyTextListStyle}>
                  {step.keyText.map((text) => (
                    <span key={text} style={keyTextStyle}>
                      {text}
                    </span>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
      {lessonPlan.summary ? (
        <p style={summaryStyle}>
          {copy.summaryPrefix}
          {lessonPlan.summary}
        </p>
      ) : null}
    </section>
  );
}

export const isTerminalJobStatus = (status: string) => {
  return status === 'completed' || status === 'failed';
};

const formatJobStatus = (status: string) => {
  const labels: Record<string, string> = {
    completed: '\u5df2\u5b8c\u6210',
    failed: '\u5931\u8d25',
    loading: '\u52a0\u8f7d\u4e2d',
    queued: '\u6392\u961f\u4e2d',
    running: '\u751f\u6210\u4e2d'
  };

  return labels[status] ?? status;
};

const formatJobStage = (stage: string) => {
  const labels: Record<string, string> = {
    audio: '\u751f\u6210\u914d\u97f3',
    done: '\u5b8c\u6210',
    job_runner: '\u4efb\u52a1\u6267\u884c',
    loading: '\u52a0\u8f7d\u4e2d',
    map: '\u751f\u6210\u5206\u955c',
    parse: '\u89e3\u6790\u9898\u76ee',
    plan: '\u89c4\u5212\u8bb2\u89e3',
    queued: '\u6392\u961f\u4e2d',
    render: '\u6e32\u67d3\u89c6\u9891',
    store: '\u4fdd\u5b58\u6587\u4ef6',
    subtitles: '\u751f\u6210\u5b57\u5e55'
  };

  return labels[stage] ?? stage;
};

const formatJobError = (error: string | undefined) => {
  if (!error) return copy.errorDefault;

  if (
    error.includes('Unsupported input for V1 linear equation parser') ||
    error.includes('\u5f53\u524d\u7248\u672c\u4ec5\u652f\u6301\u4e00\u5143\u4e00\u6b21\u65b9\u7a0b\u89e3\u6790')
  ) {
    return copy.errorParser;
  }

  return error;
};

const panelStyle = {
  background: '#fbf7ef',
  border: '1px solid #eadfca',
  borderRadius: 24,
  color: '#1f2937',
  margin: '40px auto',
  maxWidth: 1120,
  padding: 32
};

const eyebrowStyle = {
  color: '#6f7d45',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 1.6,
  textTransform: 'uppercase' as const
};

const titleStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 44,
  lineHeight: 1.1,
  margin: '8px 0 16px'
};

const actionsStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 10,
  margin: '18px 0'
};

const homeLinkStyle = {
  alignItems: 'center',
  background: '#fffaf1',
  border: '1px solid #d7c8a9',
  borderRadius: 999,
  color: '#1f2937',
  display: 'inline-flex',
  padding: '8px 14px',
  textDecoration: 'none'
};

const regenerateButtonStyle = {
  background: '#1f5134',
  border: 0,
  borderRadius: 999,
  color: '#ffffff',
  cursor: 'pointer',
  padding: '8px 14px'
};

const assetGridStyle = {
  display: 'grid',
  gap: 24,
  gridTemplateColumns: 'minmax(0, 2fr) minmax(240px, 1fr)',
  marginTop: 24
};

const statusGridStyle = {
  display: 'flex',
  gap: 18,
  flexWrap: 'wrap' as const
};

const progressTrackStyle = {
  background: '#eadfca',
  borderRadius: 999,
  height: 12,
  marginTop: 12,
  overflow: 'hidden'
};

const progressFillStyle = {
  background: '#6f7d45',
  height: '100%'
};

const previewCardStyle = {
  display: 'grid',
  gap: 16
};

const videoStyle = {
  aspectRatio: '9 / 16',
  background: '#111827',
  borderRadius: 20,
  maxHeight: 720,
  width: '100%'
};

const coverStyle = {
  borderRadius: 16,
  maxWidth: 220,
  width: '100%'
};

const linkCardStyle = {
  alignSelf: 'start',
  background: '#fffaf1',
  border: '1px solid #eadfca',
  borderRadius: 20,
  display: 'grid',
  gap: 12,
  padding: 20
};

const lessonPanelStyle = {
  background: '#fffaf1',
  border: '1px solid #eadfca',
  borderRadius: 20,
  marginTop: 24,
  padding: 24
};

const lessonTitleStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 28,
  lineHeight: 1.2,
  margin: '6px 0 12px'
};

const stepListStyle = {
  display: 'grid',
  gap: 12,
  listStyle: 'none',
  margin: '20px 0',
  padding: 0
};

const stepCardStyle = {
  background: '#ffffff',
  border: '1px solid #eadfca',
  borderRadius: 16,
  padding: 16
};

const stepTitleStyle = {
  fontSize: 18,
  margin: '0 0 8px'
};

const mutedTextStyle = {
  color: '#6b7280'
};

const keyTextListStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8,
  marginTop: 12
};

const keyTextStyle = {
  background: '#f1ead9',
  borderRadius: 999,
  color: '#374151',
  display: 'inline-flex',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontSize: 13,
  padding: '6px 10px'
};

const summaryStyle = {
  borderTop: '1px solid #eadfca',
  margin: '18px 0 0',
  paddingTop: 16
};
