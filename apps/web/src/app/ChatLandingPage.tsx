'use client';

import React, {FormEvent, useEffect, useState} from 'react';

import {AppLayout} from '../components/Layout';
import {Navigation, type NavigationItem} from '../components/Navigation';
import {SampleGallery, type SampleGalleryItem} from '../components/SampleGallery';
import {TaskList, type TaskListItem} from '../components/TaskList';
import {createJob, listJobs} from '../lib/api-client';
import {
  buildGenerationPrompt,
  chatModelOptions,
  outputTypeOptions,
  type ChatModel,
  type ChatOutputType
} from './chat-output-prompts';
import {ThemeToggle} from './ThemeToggle';

type StyleValue = 'teacher' | 'kids' | 'exam';
type DurationValue = 30 | 45 | 60;
type VoiceValue = 'female_warm' | 'female_clear' | 'male_calm';
type SpeechRateValue = 'slow' | 'normal' | 'fast';
type SubjectValue = 'math' | 'physics' | 'english' | 'chinese';
type HomeView = 'create' | 'jobs' | 'samples' | 'materials' | 'roadmap';
type VideoStyleValue = 'custom' | string;
type SampleStyle = {
  content: string;
  slug: string;
  speechRate: SpeechRateValue;
  style: StyleValue;
  targetDurationSec: DurationValue;
  taskName: string;
  title: string;
  voice: VoiceValue;
};
type JobSummary = {
  createdAt?: string;
  error?: string;
  jobId: string;
  problemText?: string;
  stage?: string;
  status?: string;
  taskName?: string;
};

type ChatLandingPageProps = {
  examplePrompts: string[];
  initialContent: string;
  initialSpeechRate?: SpeechRateValue;
  initialStyle: StyleValue;
  initialTargetDurationSec: DurationValue;
  initialVideoStyle: VideoStyleValue;
  initialView: HomeView;
  initialVoice?: VoiceValue;
  sampleStyles: SampleStyle[];
};

const navItems: NavigationItem[] = [
  {href: '/', id: 'create', label: '新建会话'},
  {href: '/?view=jobs', id: 'jobs', label: '历史任务'},
  {href: '/?view=samples', id: 'samples', label: '样片库'},
  {href: '/?view=materials', id: 'materials', label: '课程素材'}
];
const recentTasks: NavigationItem[] = [
  {href: '/?view=jobs', id: 'recent-equation', label: '初一方程讲解'},
  {href: '/?view=jobs', id: 'recent-word-problem', label: '应用题样片'},
  {href: '/?view=jobs', id: 'recent-function', label: '函数基础题'}
];
const secondaryNavItems: NavigationItem[] = [
  {href: '/?view=settings', id: 'settings', label: '设置'},
  {href: '/?view=help', id: 'help', label: '帮助'}
];
export function ChatLandingPage({
  examplePrompts,
  initialContent,
  initialSpeechRate = 'normal',
  initialStyle,
  initialTargetDurationSec,
  initialVideoStyle,
  initialView,
  initialVoice = 'female_warm',
  sampleStyles
}: ChatLandingPageProps) {
  const [content, setContent] = useState(initialContent);
  const [style, setStyle] = useState<StyleValue>(initialStyle);
  const [targetDurationSec, setTargetDurationSec] =
    useState<DurationValue>(initialTargetDurationSec);
  const [voice, setVoice] = useState<VoiceValue>(initialVoice);
  const [speechRate, setSpeechRate] = useState<SpeechRateValue>(initialSpeechRate);
  const [subject, setSubject] = useState<SubjectValue>('math');
  const [videoStyle, setVideoStyle] = useState<VideoStyleValue>(initialVideoStyle);
  const [model, setModel] = useState<ChatModel>('standard');
  const [outputType, setOutputType] = useState<ChatOutputType>('video');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [jobsStatus, setJobsStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>(
    initialView === 'jobs' ? 'loading' : 'idle'
  );

  useEffect(() => {
    if (initialView !== 'jobs') {
      return;
    }

    let isMounted = true;
    setJobsStatus('loading');

    listJobs()
      .then((payload: unknown) => {
        if (!isMounted) return;
        const nextJobs = normalizeJobsPayload(payload);
        setJobs(nextJobs);
        setJobsStatus('loaded');
      })
      .catch(() => {
        if (!isMounted) return;
        setJobs([]);
        setJobsStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, [initialView]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedContent = content.trim();

    if (!trimmedContent || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setStatus('正在创建任务...');

    try {
      const job = (await createJob({
        subject,
        grade: 'junior',
        sourceType: 'text',
        content: trimmedContent,
        generationPrompt: buildGenerationPrompt({model, outputType}),
        model,
        outputType,
        targetDurationSec,
        style,
        voice,
        speechRate
      })) as {jobId?: string; id?: string};
      const jobId = job.jobId ?? job.id;

      if (!jobId) {
        throw new Error('任务创建成功，但没有返回任务编号');
      }

      window.location.assign(`/jobs/${jobId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : '任务创建失败';
      setStatus(message === 'API_UNREACHABLE' ? '无法连接生成服务，请确认 API 已启动。' : message);
      setIsSubmitting(false);
    }
  };

  const applyVideoStyle = (slug: VideoStyleValue) => {
    setVideoStyle(slug);

    if (slug === 'custom') {
      return;
    }

    const sample = sampleStyles.find((item) => item.slug === slug);

    if (!sample) {
      return;
    }

    setContent(sample.content);
    setStyle(sample.style);
    setTargetDurationSec(sample.targetDurationSec);
    setVoice(sample.voice);
    setSpeechRate(sample.speechRate);
    setSubject('math');
  };

  return (
    <div data-chat-shell="landing">
      <AppLayout
        navigation={
          <Navigation
            brand="LoveLearning AI"
            currentId={initialView}
            items={navItems}
            recentItems={recentTasks}
            secondaryItems={secondaryNavItems}
          />
        }
      >
      <section data-chat-main="composer-surface" style={mainStyle}>
        <header style={topbarStyle}>
          <span style={productNameStyle}>LoveLearning AI</span>
          <ThemeToggle />
        </header>

        {initialView === 'create' ? (
          <CreatePanel
            content={content}
            examplePrompts={examplePrompts}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            model={model}
            outputType={outputType}
            sampleStyles={sampleStyles}
            setContent={setContent}
            setModel={setModel}
            setOutputType={setOutputType}
            setSpeechRate={setSpeechRate}
            setSubject={setSubject}
            setStyle={setStyle}
            setTargetDurationSec={setTargetDurationSec}
            setVoice={setVoice}
            setVideoStyle={applyVideoStyle}
            speechRate={speechRate}
            status={status}
            subject={subject}
            style={style}
            targetDurationSec={targetDurationSec}
            videoStyle={videoStyle}
            voice={voice}
          />
        ) : initialView === 'jobs' ? (
          <JobsPanel jobs={jobs} status={jobsStatus} />
        ) : (
          <LibraryPanel examplePrompts={examplePrompts} sampleStyles={sampleStyles} view={initialView} />
        )}
      </section>
      </AppLayout>
    </div>
  );
}

function JobsPanel({jobs, status}: {jobs: JobSummary[]; status: 'idle' | 'loading' | 'loaded' | 'error'}) {
  return (
    <div data-chat-panel="jobs" style={panelStageStyle}>
      <section style={panelHeaderStyle}>
        <h1 data-visual-hierarchy="page-title" style={panelTitleStyle}>历史任务</h1>
      </section>
      <div data-chat-jobs-list="history" style={panelListStyle}>
        {status === 'loading' ? (
          <div style={emptyPanelStyle}>正在加载任务...</div>
        ) : status === 'error' ? (
          <div style={emptyPanelStyle}>无法加载任务，请确认 API 已启动。</div>
        ) : jobs.length === 0 ? (
          <div style={emptyPanelStyle}>暂无历史任务</div>
        ) : (
          <TaskList tasks={jobs.map(mapJobToTaskListItem)} />
        )}
      </div>
    </div>
  );
}

function CreatePanel({
  content,
  examplePrompts,
  handleSubmit,
  isSubmitting,
  model,
  outputType,
  sampleStyles,
  setContent,
  setModel,
  setOutputType,
  setSpeechRate,
  setSubject,
  setStyle,
  setTargetDurationSec,
  setVoice,
  setVideoStyle,
  speechRate,
  status,
  subject,
  style,
  targetDurationSec,
  videoStyle,
  voice
}: {
  content: string;
  examplePrompts: string[];
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  model: ChatModel;
  outputType: ChatOutputType;
  sampleStyles: SampleStyle[];
  setContent: (value: string) => void;
  setModel: (value: ChatModel) => void;
  setOutputType: (value: ChatOutputType) => void;
  setSpeechRate: (value: SpeechRateValue) => void;
  setSubject: (value: SubjectValue) => void;
  setStyle: (value: StyleValue) => void;
  setTargetDurationSec: (value: DurationValue) => void;
  setVoice: (value: VoiceValue) => void;
  setVideoStyle: (value: VideoStyleValue) => void;
  speechRate: SpeechRateValue;
  status: string;
  subject: SubjectValue;
  style: StyleValue;
  targetDurationSec: DurationValue;
  videoStyle: VideoStyleValue;
  voice: VoiceValue;
}) {
  return (
    <div data-chat-panel="create" style={centerStageStyle}>
      <section style={heroStyle}>
        <h1 data-visual-hierarchy="page-title" style={titleStyle}>输入题目，生成讲解视频</h1>
        <p style={supportStyle}>当前支持：一元一次方程、数量关系</p>
      </section>

      <form data-chat-composer="problem-input" onSubmit={handleSubmit} style={composerStyle}>
        <textarea
          aria-label="题目内容"
          name="content"
          onChange={(event) => setContent(event.target.value)}
          placeholder="请输入题目内容"
          style={textareaStyle}
          value={content}
        />
        <div style={composerControlsStyle}>
          <label style={subjectFieldStyle}>
            模型
            <select
              data-chat-model-select="model"
              name="model"
              onChange={(event) => setModel(event.target.value as ChatModel)}
              style={subjectSelectStyle}
              value={model}
            >
              {chatModelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button
            aria-label="麦克风"
            data-chat-mic-button="voice-input"
            style={micButtonStyle}
            type="button"
          >
            麦克风
          </button>
          <label style={subjectFieldStyle}>
            视频风格
            <select
              data-chat-video-style-select="sample-style"
              name="sampleStyle"
              onChange={(event) => setVideoStyle(event.target.value)}
              style={subjectSelectStyle}
              value={videoStyle}
            >
              <option value="custom">自定义</option>
              {sampleStyles.map((sample) => (
                <option key={sample.slug} value={sample.slug}>
                  {sample.title}
                </option>
              ))}
            </select>
          </label>
          <label style={subjectFieldStyle}>
            学科
            <select
              data-chat-subject-select="subject"
              name="subject"
              onChange={(event) => setSubject(event.target.value as SubjectValue)}
              style={subjectSelectStyle}
              value={subject}
            >
              <option value="math">数学</option>
              <option value="physics">物理（即将开放）</option>
              <option value="english">英语（即将开放）</option>
              <option value="chinese">语文（即将开放）</option>
            </select>
          </label>
        </div>
        <div data-chat-output-options="output-types" style={outputTypesStyle}>
          {outputTypeOptions.map((item) => (
            <button
              key={item.value}
              onClick={() => setOutputType(item.value)}
              style={item.value === outputType ? activeOutputTypeStyle : outputTypeStyle}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <details data-chat-advanced-settings="collapsed-panel" style={advancedStyle}>
          <summary style={summaryStyle}>高级设置</summary>
          <div style={settingsGridStyle}>
            <label style={fieldStyle}>
              讲解风格
              <select
                name="style"
                onChange={(event) => setStyle(event.target.value as StyleValue)}
                style={selectStyle}
                value={style}
              >
                <option value="teacher">老师讲解</option>
                <option value="kids">低龄趣味</option>
                <option value="exam">应试提分</option>
              </select>
            </label>
            <label style={fieldStyle}>
              视频时长
              <select
                name="targetDurationSec"
                onChange={(event) => setTargetDurationSec(Number(event.target.value) as DurationValue)}
                style={selectStyle}
                value={String(targetDurationSec)}
              >
                <option value="30">30 秒</option>
                <option value="45">45 秒</option>
                <option value="60">60 秒</option>
              </select>
            </label>
            <label style={fieldStyle}>
              配音音色
              <select
                name="voice"
                onChange={(event) => setVoice(event.target.value as VoiceValue)}
                style={selectStyle}
                value={voice}
              >
                <option value="female_warm">温柔女声</option>
                <option value="female_clear">清晰女声</option>
                <option value="male_calm">沉稳男声</option>
              </select>
            </label>
            <label style={fieldStyle}>
              语速
              <select
                name="speechRate"
                onChange={(event) => setSpeechRate(event.target.value as SpeechRateValue)}
                style={selectStyle}
                value={speechRate}
              >
                <option value="slow">慢速</option>
                <option value="normal">标准</option>
                <option value="fast">快速</option>
              </select>
            </label>
          </div>
        </details>
        <div style={submitRowStyle}>
          <span aria-live="polite" style={statusStyle}>
            {status}
          </span>
          <button
            data-action-prominence="highest"
            data-visual-hierarchy="primary-action"
            disabled={isSubmitting}
            style={submitButtonStyle}
            type="submit"
          >
            {isSubmitting ? '生成中...' : '开始生成'}
          </button>
        </div>
      </form>
    </div>
  );
}

function LibraryPanel({
  examplePrompts,
  sampleStyles,
  view
}: {
  examplePrompts: string[];
  sampleStyles: SampleStyle[];
  view: Exclude<HomeView, 'create' | 'jobs'>;
}) {
  const panel = panelContent[view];

  return (
    <div data-chat-panel={view} style={panelStageStyle}>
      <section style={panelHeaderStyle}>
        <h1 data-visual-hierarchy="page-title" style={panelTitleStyle}>{panel.title}</h1>
      </section>
      <div style={panelListStyle}>
        {panel.items.map((item) => (
          <article key={item.title} style={panelCardStyle}>
            <strong style={panelCardTitleStyle}>{item.title}</strong>
            {item.meta ? <span style={panelMetaStyle}>{item.meta}</span> : null}
          </article>
        ))}
        {view === 'samples' ? <SampleGallery samples={sampleStyles.map(mapSampleToGalleryItem)} /> : null}
        {view === 'samples'
          ? sampleStyles.map((sample) => (
              <a
                data-chat-sample-preset={sample.slug}
                href={buildSamplePresetHref(sample)}
                key={sample.slug}
                style={jobLinkStyle}
              >
                <span style={jobTitleStackStyle}>
                  <strong style={panelCardTitleStyle}>{sample.title}</strong>
                  <span style={panelMetaStyle}>{sample.content}</span>
                </span>
                <span style={statusBadgeStyle}>套用</span>
              </a>
            ))
          : null}
        {view === 'samples'
          ? examplePrompts.slice(0, 3).map((example) => (
              <article key={example} style={panelCardStyle}>
                <strong style={panelCardTitleStyle}>{example}</strong>
                <span style={panelMetaStyle}>一元一次方程</span>
              </article>
            ))
          : null}
      </div>
    </div>
  );
}

const buildSamplePresetHref = (sample: SampleStyle) => {
  const params = new URLSearchParams({
    sampleStyle: sample.slug,
    content: sample.content,
    speechRate: sample.speechRate,
    style: sample.style,
    targetDurationSec: String(sample.targetDurationSec),
    voice: sample.voice
  });

  return `/?view=create&${params.toString()}`;
};

const mapJobToTaskListItem = (job: JobSummary): TaskListItem => ({
  createdAt: job.createdAt,
  href: `/jobs/${job.jobId}`,
  id: job.jobId,
  status: job.status,
  title: job.taskName || job.problemText || job.jobId
});

const mapSampleToGalleryItem = (sample: SampleStyle): SampleGalleryItem => ({
  durationSec: sample.targetDurationSec,
  href: buildSamplePresetHref(sample),
  id: sample.slug,
  style: sample.style === 'exam' ? '应试提分' : sample.style === 'kids' ? '低龄趣味' : '老师讲解',
  subject: '数学',
  title: sample.title,
  voice: sample.voice === 'female_clear' ? '清晰女声' : sample.voice === 'male_calm' ? '沉稳男声' : '温柔女声'
});

const panelContent: Record<
  Exclude<HomeView, 'create' | 'jobs'>,
  {title: string; items: {meta?: string; title: string}[]}
> = {
  materials: {
    title: '课程素材',
    items: [
      {meta: '即将接入', title: 'OCR 拍题识别'},
      {meta: '即将接入', title: '题库导入'},
      {meta: '即将接入', title: '课件素材'}
    ]
  },
  roadmap: {
    title: '学科规划',
    items: [
      {meta: '当前重点', title: '数学'},
      {meta: '下一阶段', title: '物理'},
      {meta: '后续扩展', title: '英语'}
    ]
  },
  samples: {
    title: '样片库',
    items: [
      {meta: '标准样片', title: '一元一次方程'},
      {meta: '标准样片', title: '数量关系应用题'}
    ]
  }
};

const normalizeJobsPayload = (payload: unknown): JobSummary[] => {
  if (!payload || typeof payload !== 'object' || !('jobs' in payload)) {
    return [];
  }

  const jobsPayload = (payload as {jobs?: unknown}).jobs;

  if (!Array.isArray(jobsPayload)) {
    return [];
  }

  return jobsPayload
    .map((job): JobSummary | null => {
      if (!job || typeof job !== 'object') return null;
      const candidate = job as Record<string, unknown>;
      const jobId = typeof candidate.jobId === 'string' ? candidate.jobId : '';

      if (!jobId) return null;

      return {
        createdAt: readOptionalString(candidate.createdAt),
        error: readOptionalString(candidate.error),
        jobId,
        problemText: readOptionalString(candidate.problemText),
        stage: readOptionalString(candidate.stage),
        status: readOptionalString(candidate.status),
        taskName: readOptionalString(candidate.taskName)
      };
    })
    .filter((job): job is JobSummary => Boolean(job));
};

const readOptionalString = (value: unknown) => (typeof value === 'string' && value.trim() ? value : undefined);

const formatJobStatus = (status: string | undefined) => {
  if (status === 'completed') return '已完成';
  if (status === 'running') return '生成中';
  if (status === 'failed') return '失败';
  if (status === 'queued') return '排队中';

  return '未知';
};

const shellStyle = {
  background: '#f7f7f5',
  color: '#171717',
  display: 'grid',
  fontFamily: '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  gridTemplateColumns: '220px minmax(0, 1fr)',
  minHeight: '100vh'
};

const sidebarStyle = {
  background: '#ffffff',
  borderRight: '1px solid #e7e5e4',
  display: 'grid',
  gridTemplateRows: 'auto auto 1fr auto',
  minHeight: '100vh',
  padding: '18px 14px'
};

const brandStyle = {
  color: '#111827',
  fontSize: 16,
  fontWeight: 700,
  padding: '10px 8px',
  textDecoration: 'none'
};

const navStyle = {
  display: 'grid',
  gap: 4,
  marginTop: 18
};

const navItemStyle = {
  borderRadius: 10,
  color: '#525252',
  display: 'block',
  fontSize: 14,
  padding: '10px 9px',
  textDecoration: 'none'
};

const activeNavItemStyle = {
  ...navItemStyle,
  background: '#f0f0ef',
  color: '#111827',
  fontWeight: 700
};

const recentSectionStyle = {
  alignSelf: 'start',
  display: 'grid',
  gap: 8,
  marginTop: 26
};

const sectionLabelStyle = {
  color: '#8a8a8a',
  fontSize: 12,
  padding: '0 9px'
};

const recentListStyle = {
  display: 'grid',
  gap: 2
};

const recentItemStyle = {
  ...navItemStyle,
  fontSize: 13
};

const sidebarFooterStyle = {
  borderTop: '1px solid #eeeeec',
  display: 'grid',
  gap: 2,
  paddingTop: 10
};

const mainStyle = {
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
  minHeight: '100vh'
};

const topbarStyle = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '18px 28px'
};

const productNameStyle = {
  color: '#525252',
  fontSize: 14,
  fontWeight: 600
};

const centerStageStyle = {
  alignContent: 'center',
  display: 'grid',
  gap: 22,
  justifyItems: 'center',
  padding: '36px 24px 80px'
};

const heroStyle = {
  display: 'grid',
  gap: 10,
  justifyItems: 'center',
  textAlign: 'center' as const
};

const titleStyle = {
  color: '#111827',
  fontSize: 34,
  fontWeight: 700,
  letterSpacing: '-0.03em',
  lineHeight: 1.2,
  margin: 0
};

const supportStyle = {
  color: '#737373',
  fontSize: 14,
  margin: 0
};

const composerStyle = {
  background: '#ffffff',
  border: '2px solid #111827',
  borderRadius: 24,
  boxShadow: '0 20px 50px rgba(15, 23, 42, 0.1)',
  display: 'grid',
  gap: 14,
  maxWidth: 820,
  padding: 16,
  width: '100%'
};

const textareaStyle = {
  border: 0,
  color: '#171717',
  fontFamily: 'inherit',
  fontSize: 17,
  lineHeight: 1.7,
  minHeight: 138,
  outline: 'none',
  resize: 'vertical' as const,
  width: '100%'
};

const micButtonStyle = {
  background: '#ffffff',
  border: '1px solid #dedbd6',
  borderRadius: 12,
  color: '#171717',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 13,
  padding: '8px 11px'
};

const outputTypesStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8
};

const outputTypeStyle = {
  background: '#ffffff',
  border: '1px solid #dedbd6',
  borderRadius: 999,
  color: '#525252',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 13,
  padding: '8px 12px'
};

const activeOutputTypeStyle = {
  ...outputTypeStyle,
  background: '#111827',
  borderColor: '#111827',
  color: '#ffffff'
};

const chipsStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 8
};

const chipStyle = {
  background: '#f6f6f4',
  border: '1px solid #eceae7',
  borderRadius: 999,
  color: '#44403c',
  cursor: 'pointer',
  fontSize: 13,
  padding: '7px 11px'
};

const examplesStyle = {
  display: 'grid',
  gap: 8
};

const composerControlsStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 10
};

const subjectFieldStyle = {
  alignItems: 'center',
  background: '#f8f8f7',
  border: '1px solid #eeeeec',
  borderRadius: 12,
  color: '#737373',
  display: 'inline-flex',
  fontSize: 13,
  gap: 8,
  padding: '7px 9px'
};

const subjectSelectStyle = {
  background: '#ffffff',
  border: '1px solid #dedbd6',
  borderRadius: 9,
  color: '#171717',
  fontFamily: 'inherit',
  fontSize: 13,
  padding: '6px 8px'
};

const exampleButtonStyle = {
  background: 'transparent',
  border: '1px solid #eeeeec',
  borderRadius: 12,
  color: '#57534e',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: 13,
  lineHeight: 1.5,
  padding: '9px 11px',
  textAlign: 'left' as const
};

const advancedStyle = {
  borderTop: '1px solid #eeeeec',
  paddingTop: 10
};

const summaryStyle = {
  color: '#525252',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600
};

const settingsGridStyle = {
  display: 'grid',
  gap: 10,
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  paddingTop: 12
};

const fieldStyle = {
  color: '#737373',
  display: 'grid',
  fontSize: 12,
  gap: 6
};

const selectStyle = {
  background: '#ffffff',
  border: '1px solid #dedbd6',
  borderRadius: 10,
  color: '#171717',
  fontFamily: 'inherit',
  fontSize: 14,
  padding: '9px 10px'
};

const submitRowStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: 12,
  justifyContent: 'space-between'
};

const statusStyle = {
  color: '#78716c',
  fontSize: 13
};

const submitButtonStyle = {
  background: '#111827',
  border: 0,
  borderRadius: 14,
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: 15,
  fontWeight: 700,
  padding: '12px 18px'
};

const panelStageStyle = {
  alignContent: 'start',
  display: 'grid',
  gap: 18,
  justifySelf: 'center',
  maxWidth: 820,
  padding: '84px 24px',
  width: '100%'
};

const panelHeaderStyle = {
  display: 'grid',
  gap: 8
};

const panelTitleStyle = {
  color: '#111827',
  fontSize: 28,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  margin: 0
};

const panelListStyle = {
  display: 'grid',
  gap: 10
};

const panelCardStyle = {
  background: '#ffffff',
  border: '1px solid #e7e5e4',
  borderRadius: 16,
  display: 'flex',
  gap: 12,
  justifyContent: 'space-between',
  padding: '15px 16px'
};

const panelCardTitleStyle = {
  color: '#171717',
  fontSize: 15,
  fontWeight: 650
};

const panelMetaStyle = {
  color: '#737373',
  fontSize: 13
};

const emptyPanelStyle = {
  background: '#ffffff',
  border: '1px solid #e7e5e4',
  borderRadius: 16,
  color: '#737373',
  padding: '18px 16px'
};

const jobLinkStyle = {
  ...panelCardStyle,
  color: '#171717',
  textDecoration: 'none'
};

const jobTitleStackStyle = {
  display: 'grid',
  gap: 4,
  minWidth: 0
};

const statusBadgeStyle = {
  alignSelf: 'start',
  background: '#f6f6f4',
  borderRadius: 999,
  color: '#525252',
  flexShrink: 0,
  fontSize: 12,
  padding: '5px 9px'
};
