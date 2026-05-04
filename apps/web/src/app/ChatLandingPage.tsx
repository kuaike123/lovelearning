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
import * as chatStyles from './ChatLandingPage.styles';
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
      <section data-chat-main="composer-surface" style={chatStyles.mainStyle}>
        <header style={chatStyles.topbarStyle}>
          <span style={chatStyles.productNameStyle}>LoveLearning AI</span>
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
    <div data-chat-panel="jobs" style={chatStyles.panelStageStyle}>
      <section style={chatStyles.panelHeaderStyle}>
        <h1 data-visual-hierarchy="page-title" style={chatStyles.panelTitleStyle}>历史任务</h1>
      </section>
      <div data-chat-jobs-list="history" style={chatStyles.panelListStyle}>
        {status === 'loading' ? (
          <div style={chatStyles.emptyPanelStyle}>正在加载任务...</div>
        ) : status === 'error' ? (
          <div style={chatStyles.emptyPanelStyle}>无法加载任务，请确认 API 已启动。</div>
        ) : jobs.length === 0 ? (
          <div style={chatStyles.emptyPanelStyle}>暂无历史任务</div>
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
    <div data-chat-panel="create" style={chatStyles.centerStageStyle}>
      <section style={chatStyles.heroStyle}>
        <h1 data-visual-hierarchy="page-title" style={chatStyles.titleStyle}>输入题目，生成讲解视频</h1>
        <p style={chatStyles.supportStyle}>当前支持：一元一次方程、数量关系</p>
      </section>

      <form data-chat-composer="problem-input" onSubmit={handleSubmit} style={chatStyles.composerStyle}>
        <textarea
          aria-label="题目内容"
          name="content"
          onChange={(event) => setContent(event.target.value)}
          placeholder="请输入题目内容"
          style={chatStyles.textareaStyle}
          value={content}
        />
        <div style={chatStyles.composerControlsStyle}>
          <label style={chatStyles.subjectFieldStyle}>
            模型
            <select
              data-chat-model-select="model"
              name="model"
              onChange={(event) => setModel(event.target.value as ChatModel)}
              style={chatStyles.subjectSelectStyle}
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
            style={chatStyles.micButtonStyle}
            type="button"
          >
            麦克风
          </button>
          <label style={chatStyles.subjectFieldStyle}>
            视频风格
            <select
              data-chat-video-style-select="sample-style"
              name="sampleStyle"
              onChange={(event) => setVideoStyle(event.target.value)}
              style={chatStyles.subjectSelectStyle}
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
          <label style={chatStyles.subjectFieldStyle}>
            学科
            <select
              data-chat-subject-select="subject"
              name="subject"
              onChange={(event) => setSubject(event.target.value as SubjectValue)}
              style={chatStyles.subjectSelectStyle}
              value={subject}
            >
              <option value="math">数学</option>
              <option value="physics">物理（即将开放）</option>
              <option value="english">英语（即将开放）</option>
              <option value="chinese">语文（即将开放）</option>
            </select>
          </label>
        </div>
        <div data-chat-output-options="output-types" style={chatStyles.outputTypesStyle}>
          {outputTypeOptions.map((item) => (
            <button
              key={item.value}
              onClick={() => setOutputType(item.value)}
              style={item.value === outputType ? chatStyles.activeOutputTypeStyle : chatStyles.outputTypeStyle}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <details data-chat-advanced-settings="collapsed-panel" style={chatStyles.advancedStyle}>
          <summary style={chatStyles.summaryStyle}>高级设置</summary>
          <div style={chatStyles.settingsGridStyle}>
            <label style={chatStyles.fieldStyle}>
              讲解风格
              <select
                name="style"
                onChange={(event) => setStyle(event.target.value as StyleValue)}
                style={chatStyles.selectStyle}
                value={style}
              >
                <option value="teacher">老师讲解</option>
                <option value="kids">低龄趣味</option>
                <option value="exam">应试提分</option>
              </select>
            </label>
            <label style={chatStyles.fieldStyle}>
              视频时长
              <select
                name="targetDurationSec"
                onChange={(event) => setTargetDurationSec(Number(event.target.value) as DurationValue)}
                style={chatStyles.selectStyle}
                value={String(targetDurationSec)}
              >
                <option value="30">30 秒</option>
                <option value="45">45 秒</option>
                <option value="60">60 秒</option>
              </select>
            </label>
            <label style={chatStyles.fieldStyle}>
              配音音色
              <select
                name="voice"
                onChange={(event) => setVoice(event.target.value as VoiceValue)}
                style={chatStyles.selectStyle}
                value={voice}
              >
                <option value="female_warm">温柔女声</option>
                <option value="female_clear">清晰女声</option>
                <option value="male_calm">沉稳男声</option>
              </select>
            </label>
            <label style={chatStyles.fieldStyle}>
              语速
              <select
                name="speechRate"
                onChange={(event) => setSpeechRate(event.target.value as SpeechRateValue)}
                style={chatStyles.selectStyle}
                value={speechRate}
              >
                <option value="slow">慢速</option>
                <option value="normal">标准</option>
                <option value="fast">快速</option>
              </select>
            </label>
          </div>
        </details>
        <div style={chatStyles.submitRowStyle}>
          <span aria-live="polite" style={chatStyles.statusStyle}>
            {status}
          </span>
          <button
            data-action-prominence="highest"
            data-visual-hierarchy="primary-action"
            disabled={isSubmitting}
            style={chatStyles.submitButtonStyle}
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
    <div data-chat-panel={view} style={chatStyles.panelStageStyle}>
      <section style={chatStyles.panelHeaderStyle}>
        <h1 data-visual-hierarchy="page-title" style={chatStyles.panelTitleStyle}>{panel.title}</h1>
      </section>
      <div style={chatStyles.panelListStyle}>
        {panel.items.map((item) => (
          <article key={item.title} style={chatStyles.panelCardStyle}>
            <strong style={chatStyles.panelCardTitleStyle}>{item.title}</strong>
            {item.meta ? <span style={chatStyles.panelMetaStyle}>{item.meta}</span> : null}
          </article>
        ))}
        {view === 'samples' ? <SampleGallery samples={sampleStyles.map(mapSampleToGalleryItem)} /> : null}
        {view === 'samples'
          ? sampleStyles.map((sample) => (
              <a
                data-chat-sample-preset={sample.slug}
                href={buildSamplePresetHref(sample)}
                key={sample.slug}
                style={chatStyles.jobLinkStyle}
              >
                <span style={chatStyles.jobTitleStackStyle}>
                  <strong style={chatStyles.panelCardTitleStyle}>{sample.title}</strong>
                  <span style={chatStyles.panelMetaStyle}>{sample.content}</span>
                </span>
                <span style={chatStyles.statusBadgeStyle}>套用</span>
              </a>
            ))
          : null}
        {view === 'samples'
          ? examplePrompts.slice(0, 3).map((example) => (
              <article key={example} style={chatStyles.panelCardStyle}>
                <strong style={chatStyles.panelCardTitleStyle}>{example}</strong>
                <span style={chatStyles.panelMetaStyle}>一元一次方程</span>
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
