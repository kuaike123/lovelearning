'use client';

import React, {useEffect, useState} from 'react';

import {getJob, getLessonPlan, regenerateJob} from '../../../lib/api-client';
import {createButtonStyle, createCardStyle} from '../../ui-primitives';

type Job = {
  jobId: string;
  status: string;
  stage?: string;
  progress?: number;
  error?: string;
  taskName?: string;
  voice?: 'female_warm' | 'female_clear' | 'male_calm';
  speechRate?: 'slow' | 'normal' | 'fast';
  narrationTone?: string;
  coverTone?: string;
  videoUrl?: string;
  coverUrl?: string;
  audioUrls?: string[];
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

type TimelineState = 'done' | 'current' | 'pending';

const copy = {
  actionsHome: '返回首页',
  actionsRegenerate: '重新生成',
  assetAudio: '配音音频',
  assetCover: '封面图',
  assetDeliveryList: '交付清单',
  assetDownloadTitle: '下载文件',
  assetJson: '讲解 JSON',
  assetPositioningTitle: '成片定位',
  assetPreviewTitle: '成片预览',
  assetSubtitle: '字幕文件',
  assetUsageTitle: '可直接用于',
  assetVideo: '视频成片',
  coverAlt: '生成的讲解视频封面',
  errorDefault: '任务生成失败',
  errorLoad: '任务加载失败',
  errorParser: '当前版本仅支持一元一次方程解析，请输入类似“解方程：2x + 3 = 11”的题目。',
  errorPrefix: '错误：',
  fieldJobId: '任务 ID：',
  fieldTaskName: '任务名称：',
  generatedNotice: '视频正在生成中，本页面会自动刷新。',
  learningGoalPrefix: '学习目标：',
  lessonOutline: '讲解大纲',
  loadingProgress: '生成进度',
  mainEyebrow: '视频生成任务',
  mainTitle: '数学讲解视频预览',
  overviewEyebrow: '任务概览',
  overviewOutcome: '预计结果',
  overviewStage: '当前生成阶段',
  overviewTask: '当前任务',
  overviewTone: '讲解策略',
  overviewVoice: '配音设置',
  progressPrefix: '进度：',
  stagePrefix: '阶段：',
  statusPrefix: '状态：',
  summaryPrefix: '总结：',
  unnamedTask: '未命名任务',
  visualIntentPrefix: '画面设计：'
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

    const loadPlan = async () => {
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

    void loadPlan();

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
      <p style={mutedTextStyle}>
        {copy.fieldTaskName}
        {job?.taskName ?? copy.unnamedTask}
        {' · '}
        {copy.fieldJobId}
        {jobId}
      </p>

      <section style={heroGridStyle}>
        <div style={heroPrimaryStyle}>
          <JobStatusSummary job={job ?? {jobId, status: 'loading'}} />
          <JobResultActions jobId={jobId} onRegenerate={handleRegenerate} />
          {job && !isTerminalJobStatus(job.status) ? <p aria-live="polite">{copy.generatedNotice}</p> : null}
          {job?.status === 'failed' ? <p role="alert">{formatJobError(job.error)}</p> : null}
        </div>
        {job ? <JobAssetPreview job={job} /> : null}
      </section>

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

export function JobStatusSummary({
  job
}: {
  job: Pick<
    Job,
    'coverTone' | 'error' | 'narrationTone' | 'progress' | 'speechRate' | 'status' | 'stage' | 'taskName' | 'voice'
  >;
}) {
  const progress = typeof job.progress === 'number' ? clampProgress(job.progress) : null;
  const outcome = describeOutcome(job.status, progress);
  const stageLabel = job.stage ? formatJobStage(job.stage) : formatJobStatus(job.status);
  const taskLabel = job.taskName ?? copy.unnamedTask;
  const timeline = buildStageTimeline(job.status, job.stage);

  return (
    <>
      <section data-result-section="result-overview" style={overviewCardStyle}>
        <p style={eyebrowStyle}>{copy.overviewEyebrow}</p>
        <div style={overviewGridStyle}>
          <div style={overviewItemStyle}>
            <span style={overviewLabelStyle}>{copy.overviewTask}</span>
            <strong style={overviewValueStyle}>{taskLabel}</strong>
          </div>
          <div style={overviewItemStyle}>
            <span style={overviewLabelStyle}>{copy.overviewStage}</span>
            <strong style={overviewValueStyle}>{stageLabel}</strong>
          </div>
          <div style={overviewItemStyle}>
            <span style={overviewLabelStyle}>{copy.overviewOutcome}</span>
            <strong style={overviewValueStyle}>{outcome}</strong>
          </div>
          <div style={overviewItemStyle}>
            <span style={overviewLabelStyle}>{copy.overviewVoice}</span>
            <strong style={overviewValueStyle}>
              {formatVoice(job.voice)} / {formatSpeechRate(job.speechRate)}
            </strong>
          </div>
          <div style={overviewItemStyle}>
            <span style={overviewLabelStyle}>{copy.overviewTone}</span>
            <strong style={overviewValueStyle}>
              {job.narrationTone ?? '清晰讲题'}
              {' / '}
              {job.coverTone ?? '标准题解模板'}
            </strong>
          </div>
        </div>
      </section>

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

      <section data-stage-timeline="job-progress" style={timelineSectionStyle}>
        <div style={timelineHeaderStyle}>
          <strong style={timelineTitleStyle}>{'生成路径'}</strong>
          <span style={timelineHintStyle}>{`当前节点：${stageLabel}`}</span>
        </div>
        <div style={timelineStepsStyle}>
          {timeline.map((entry) => (
            <article
              key={entry.key}
              data-stage-state={entry.state}
              style={{
                ...timelineStepStyle,
                ...(entry.state === 'done'
                  ? timelineStepDoneStyle
                  : entry.state === 'current'
                    ? timelineStepCurrentStyle
                    : timelineStepPendingStyle)
              }}
            >
              <span style={timelineStepLabelStyle}>{entry.label}</span>
            </article>
          ))}
        </div>
      </section>

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

      {job.status === 'failed' ? (
        <section style={failureAdviceStyle}>
          <strong style={failureAdviceTitleStyle}>{'处理建议'}</strong>
          <p style={failureAdviceBodyStyle}>{getFailureAdvice(job.error)}</p>
        </section>
      ) : null}
    </>
  );
}

export function JobAssetPreview({job}: {job: Job}) {
  if (!job.videoUrl && !job.coverUrl) {
    return null;
  }

  return (
    <section style={previewPanelStyle}>
      <p style={eyebrowStyle}>{copy.assetPreviewTitle}</p>
      <div style={previewCardStyle}>
        {job.videoUrl ? (
          <video controls poster={job.coverUrl} src={job.videoUrl} style={videoStyle}>
            <a href={job.videoUrl}>{copy.assetVideo}</a>
          </video>
        ) : null}
        {job.coverUrl ? <img alt={copy.coverAlt} src={job.coverUrl} style={coverStyle} /> : null}
      </div>
    </section>
  );
}

export function JobAssetList({job}: {job: Job}) {
  if (job.status !== 'completed') {
    return null;
  }

  return (
    <section data-result-section="delivery-assets" style={deliverySectionStyle}>
      <div style={linkCardStyle}>
        <p style={eyebrowStyle}>{copy.assetDownloadTitle}</p>
        <div style={deliveryBlockStyle}>
          <p style={deliveryTitleStyle}>{copy.assetDeliveryList}</p>
          <div style={deliveryChipListStyle}>
            <span style={deliveryChipStyle}>竖屏讲解视频</span>
            <span style={deliveryChipStyle}>配音音轨</span>
            <span style={deliveryChipStyle}>中文字幕文件</span>
            <span style={deliveryChipStyle}>讲解脚本 JSON</span>
            <span style={deliveryChipStyle}>封面预览图</span>
          </div>
        </div>
        {job.videoUrl ? <a href={job.videoUrl}>{copy.assetVideo}</a> : null}
        {job.coverUrl ? <a href={job.coverUrl}>{copy.assetCover}</a> : null}
        {job.audioUrls?.map((audioUrl, index) => (
          <a href={audioUrl} key={audioUrl}>
            {copy.assetAudio}
            {job.audioUrls && job.audioUrls.length > 1 ? ` ${index + 1}` : ''}
          </a>
        ))}
        {job.subtitleUrl ? <a href={job.subtitleUrl}>{copy.assetSubtitle}</a> : null}
        {job.lessonPlanUrl ? <a href={job.lessonPlanUrl}>{copy.assetJson}</a> : null}
        <div style={usageBlockStyle}>
          <p style={deliveryTitleStyle}>{copy.assetPositioningTitle}</p>
          <p style={positioningTextStyle}>
            {'当前结果默认按 9:16 竖屏教培短视频组织，可直接作为招生展示、错题讲解和家长沟通素材。'}
          </p>
        </div>
        <div style={usageBlockStyle}>
          <p style={deliveryTitleStyle}>{copy.assetUsageTitle}</p>
          <ul style={usageListStyle}>
            <li>招生短视频发布</li>
            <li>错题讲解回传</li>
            <li>家长示范与课前预习</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function LessonPlanSummary({lessonPlan}: {lessonPlan: LessonPlan}) {
  return (
    <section data-result-section="lesson-outline" style={lessonPanelStyle}>
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
    job_runner: '执行任务',
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

const formatVoice = (voice: Job['voice']) => {
  const labels: Record<NonNullable<Job['voice']>, string> = {
    female_clear: '清晰女声',
    female_warm: '温柔女声',
    male_calm: '沉稳男声'
  };

  return voice ? labels[voice] : '温柔女声';
};

const formatSpeechRate = (speechRate: Job['speechRate']) => {
  const labels: Record<NonNullable<Job['speechRate']>, string> = {
    fast: '快速',
    normal: '正常',
    slow: '慢速'
  };

  return speechRate ? labels[speechRate] : '正常';
};

const describeOutcome = (status: string, progress: number | null) => {
  if (status === 'completed') {
    return '视频、字幕和封面已可下载';
  }

  if (status === 'failed') {
    return '本次生成未成功，可重新发起任务';
  }

  if (progress !== null && progress >= 85) {
    return '即将输出成片，请稍候';
  }

  if (progress !== null && progress >= 45) {
    return '正在组装配音、动画和字幕';
  }

  return '正在准备讲解脚本与视频材料';
};

const formatJobError = (error: string | undefined) => {
  if (!error) return copy.errorDefault;

  if (error.includes('Unsupported input for V1 linear equation parser') || error.includes('当前版本仅支持一元一次方程解析')) {
    return copy.errorParser;
  }

  return error;
};

const buildStageTimeline = (
  status: string,
  stage?: string
): Array<{key: string; label: string; state: TimelineState}> => {
  const steps = [
    {key: 'parse', label: '解析题目'},
    {key: 'plan', label: '规划讲解'},
    {key: 'audio', label: '生成配音'},
    {key: 'render', label: '渲染视频'},
    {key: 'done', label: '输出成片'}
  ];

  const normalizedStage =
    stage === 'map'
      ? 'plan'
      : stage === 'subtitles' || stage === 'store'
        ? 'done'
        : stage === 'job_runner' || stage === 'queued' || stage === 'loading'
          ? 'parse'
          : stage;

  const currentIndex =
    normalizedStage && steps.some((entry) => entry.key === normalizedStage)
      ? steps.findIndex((entry) => entry.key === normalizedStage)
      : status === 'completed'
        ? steps.length - 1
        : 0;

  return steps.map((entry, index) => {
    const state: TimelineState =
      status === 'completed'
        ? 'done'
        : index < currentIndex
          ? 'done'
          : index === currentIndex
            ? 'current'
            : 'pending';

    return {
      ...entry,
      state
    };
  });
};

const getFailureAdvice = (error: string | undefined) => {
  if (!error) {
    return '请先回看任务输入与音色参数，再重新生成一次。';
  }

  if (error.includes('Unsupported input for V1 linear equation parser') || error.includes('当前版本仅支持一元一次方程解析')) {
    return '先检查题目输入是否为当前版本支持的题型，再重新发起生成。';
  }

  return '请优先检查失败原因与当前参数配置，确认后再重新生成。';
};

const clampProgress = (progress: number) => Math.max(0, Math.min(100, Math.round(progress)));

const panelStyle = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,250,241,0.92))',
  border: '1px solid #eadfca',
  borderRadius: 28,
  boxShadow: '0 18px 56px rgba(16, 42, 67, 0.08)',
  color: '#1f2937',
  margin: 0,
  maxWidth: 1120,
  padding: 30
};

const eyebrowStyle = {
  color: '#6f7d45',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 1.6,
  textTransform: 'uppercase' as const
};

const titleStyle = {
  color: '#1c1a17',
  fontFamily: '"Times New Roman", Georgia, "Noto Serif SC", serif',
  fontSize: 44,
  lineHeight: 1.1,
  margin: '8px 0 16px'
};

const mutedTextStyle = {
  color: '#6b7280'
};

const heroGridStyle = {
  alignItems: 'start',
  display: 'grid',
  gap: 24,
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  marginTop: 24
};

const heroPrimaryStyle = {
  display: 'grid',
  gap: 14
};

const actionsStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 10,
  marginTop: 4
};

const homeLinkStyle = {
  ...createButtonStyle({tone: 'secondary'}),
  alignItems: 'center',
  padding: '8px 14px'
};

const regenerateButtonStyle = {
  ...createButtonStyle({tone: 'primary'}),
  background: '#1f5134',
  border: '1px solid #1f5134',
  padding: '8px 14px'
};

const overviewCardStyle = {
  background:
    'radial-gradient(circle at 92% 8%, rgba(255, 36, 66, 0.08), transparent 26%), linear-gradient(135deg, #fffaf1 0%, #ffffff 100%)',
  border: '1px solid #eadfca',
  borderRadius: 20,
  display: 'grid',
  gap: 16,
  padding: 20
};

const overviewGridStyle = {
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
};

const overviewItemStyle = {
  display: 'grid',
  gap: 6
};

const overviewLabelStyle = {
  color: '#6b7280',
  fontSize: 13,
  fontWeight: 700
};

const overviewValueStyle = {
  color: '#1f2937',
  fontSize: 18,
  lineHeight: 1.4
};

const statusGridStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 18
};

const timelineSectionStyle = {
  background: '#ffffff',
  border: '1px solid #eadfca',
  borderRadius: 18,
  display: 'grid',
  gap: 12,
  marginTop: 16,
  padding: 16
};

const timelineHeaderStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8,
  justifyContent: 'space-between'
};

const timelineTitleStyle = {
  color: '#102A43',
  fontSize: 16,
  fontWeight: 800
};

const timelineHintStyle = {
  color: '#6b7280',
  fontSize: 13,
  fontWeight: 700
};

const timelineStepsStyle = {
  display: 'grid',
  gap: 10,
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'
};

const timelineStepStyle = {
  borderRadius: 14,
  display: 'grid',
  gap: 4,
  padding: '12px 14px'
};

const timelineStepDoneStyle = {
  background: '#e7f0da',
  border: '1px solid #cfe0bc'
};

const timelineStepCurrentStyle = {
  background: '#fff4cc',
  border: '1px solid #f5c542',
  boxShadow: '0 8px 16px rgba(245, 197, 66, 0.18)'
};

const timelineStepPendingStyle = {
  background: '#f8fafc',
  border: '1px solid #e5e7eb'
};

const timelineStepLabelStyle = {
  color: '#102A43',
  fontSize: 14,
  fontWeight: 700
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

const failureAdviceStyle = {
  background: '#fff1f2',
  border: '1px solid #fecdd3',
  borderRadius: 16,
  display: 'grid',
  gap: 8,
  marginTop: 16,
  padding: 16
};

const failureAdviceTitleStyle = {
  color: '#9f1239',
  fontSize: 15,
  fontWeight: 800
};

const failureAdviceBodyStyle = {
  color: '#881337',
  lineHeight: 1.7,
  margin: 0
};

const previewPanelStyle = {
  ...createCardStyle()
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

const deliverySectionStyle = {
  marginTop: 24
};

const linkCardStyle = {
  ...createCardStyle(),
  gap: 12
};

const deliveryBlockStyle = {
  display: 'grid',
  gap: 10
};

const deliveryTitleStyle = {
  color: '#1f2937',
  fontSize: 14,
  fontWeight: 800,
  margin: 0
};

const deliveryChipListStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8
};

const deliveryChipStyle = {
  background: '#f1ead9',
  borderRadius: 999,
  color: '#374151',
  display: 'inline-flex',
  fontSize: 12,
  fontWeight: 700,
  padding: '6px 10px'
};

const usageBlockStyle = {
  borderTop: '1px solid #eadfca',
  display: 'grid',
  gap: 8,
  marginTop: 4,
  paddingTop: 12
};

const usageListStyle = {
  color: '#374151',
  lineHeight: 1.6,
  margin: 0,
  paddingLeft: 18
};

const positioningTextStyle = {
  color: '#374151',
  lineHeight: 1.7,
  margin: 0
};

const lessonPanelStyle = {
  ...createCardStyle(),
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
