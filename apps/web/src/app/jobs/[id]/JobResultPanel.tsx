'use client';

import React, {useEffect, useState} from 'react';

import {getJob, getLessonPlan} from '../../../lib/api-client';

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
        if (active) setError('任务加载失败');
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

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section style={panelStyle}>
      <p style={eyebrowStyle}>视频生成任务</p>
      <h1 style={titleStyle}>数学讲解视频预览</h1>
      <p>任务名称：{job?.taskName ?? '未命名任务'}</p>
      <p style={mutedTextStyle}>任务 ID：{jobId}</p>
      <JobStatusSummary job={job ?? {jobId, status: 'loading'}} />
      {job && !isTerminalJobStatus(job.status) ? (
        <p aria-live="polite">视频正在生成中，本页面会自动刷新。</p>
      ) : null}
      {job?.status === 'failed' ? <p role="alert">{formatJobError(job.error)}</p> : null}
      {job ? <JobAssetList job={job} /> : null}
      {lessonPlan ? <LessonPlanSummary lessonPlan={lessonPlan} /> : null}
    </section>
  );
}

export function JobStatusSummary({job}: {job: Pick<Job, 'error' | 'progress' | 'status' | 'stage' | 'taskName'>}) {
  const progress = typeof job.progress === 'number' ? Math.max(0, Math.min(100, Math.round(job.progress))) : null;

  return (
    <>
      <div style={statusGridStyle}>
        {job.taskName ? <p>任务名称：{job.taskName}</p> : null}
        <p>状态：{formatJobStatus(job.status)}</p>
        {job.stage ? <p>阶段：{formatJobStage(job.stage)}</p> : null}
        {progress !== null ? <p>进度：{progress}%</p> : null}
        {job.status === 'failed' ? <p>错误：{formatJobError(job.error)}</p> : null}
      </div>
      {progress !== null ? (
        <div
          aria-label="生成进度"
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
          <video
            controls
            poster={job.coverUrl}
            src={job.videoUrl}
            style={videoStyle}
          >
            <a href={job.videoUrl}>视频</a>
          </video>
        ) : null}
        {job.coverUrl ? (
          <img
            alt="生成的讲解视频封面"
            src={job.coverUrl}
            style={coverStyle}
          />
        ) : null}
      </div>
      <div style={linkCardStyle}>
        <p style={eyebrowStyle}>下载文件</p>
        {job.videoUrl ? <a href={job.videoUrl}>视频</a> : null}
        {job.coverUrl ? <a href={job.coverUrl}>封面</a> : null}
        {job.subtitleUrl ? <a href={job.subtitleUrl}>字幕</a> : null}
        {job.lessonPlanUrl ? <a href={job.lessonPlanUrl}>讲解 JSON</a> : null}
      </div>
    </div>
  );
}

export function LessonPlanSummary({lessonPlan}: {lessonPlan: LessonPlan}) {
  return (
    <section style={lessonPanelStyle}>
      <p style={eyebrowStyle}>讲解大纲</p>
      <h2 style={lessonTitleStyle}>{lessonPlan.title}</h2>
      {lessonPlan.learningGoal ? <p>学习目标：{lessonPlan.learningGoal}</p> : null}
      {lessonPlan.steps?.length ? (
        <ol style={stepListStyle}>
          {lessonPlan.steps.map((step, index) => (
            <li key={step.id} style={stepCardStyle}>
              <h3 style={stepTitleStyle}>
                {index + 1}. {step.teachingGoal ?? step.id}
              </h3>
              <p>{step.narration}</p>
              {step.visualIntent ? <p style={mutedTextStyle}>画面设计：{step.visualIntent}</p> : null}
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
      {lessonPlan.summary ? <p style={summaryStyle}>总结：{lessonPlan.summary}</p> : null}
    </section>
  );
}

export const isTerminalJobStatus = (status: string) => {
  return status === 'completed' || status === 'failed';
};

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

const formatJobStage = (stage: string) => {
  const labels: Record<string, string> = {
    audio: '生成配音',
    done: '完成',
    job_runner: '任务执行',
    loading: '加载中',
    map: '生成分镜',
    parse: '解析题目',
    plan: '规划讲解',
    queued: '排队中',
    render: '渲染视频',
    store: '保存文件',
    subtitles: '生成字幕'
  };

  return labels[stage] ?? stage;
};

const formatJobError = (error: string | undefined) => {
  if (!error) return '任务生成失败';

  if (
    error.includes('Unsupported input for V1 linear equation parser') ||
    error.includes('当前版本仅支持一元一次方程解析')
  ) {
    return '当前版本仅支持一元一次方程解析，请输入类似“解方程：2x + 3 = 11”的题目。';
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
