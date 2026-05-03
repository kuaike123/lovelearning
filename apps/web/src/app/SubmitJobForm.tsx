'use client';

import React, {ButtonHTMLAttributes, FormEvent, useMemo, useState} from 'react';

import {createJob, previewTts} from '../lib/api-client';
import {
  createSketchButtonStyle,
  createSketchCardStyle,
  createSketchEyebrowStyle,
  createSketchGridBackground,
  createSketchPillStyle,
  sketchColors
} from './ui-primitives';
import {
  createBadgeStyle as createBadgeStyleV2,
  createButtonStyle as createButtonStyleV2,
  createCardStyle as createCardStyleV2,
  createInputStyle as createInputStyleV2,
  createLabelStyle as createLabelStyleV2,
  designTokens,
  keyframes as keyframesV2
} from './ui-primitives-v2';
import {recommendVoicePreset} from './voice-recommendation';

type VoiceOption = 'female_warm' | 'female_clear' | 'male_calm';
type SpeechRate = 'slow' | 'normal' | 'fast';
type FormStep = 'content' | 'settings' | 'voice' | 'review';
type CreationStep = {id: FormStep; label: string; meta: string; targetId: string};

type VoicePreview = {
  audioUrl: string;
  durationSec: number;
  narrationTone?: string;
  previewText?: string;
  voice: VoiceOption;
};

type SubmitJobFormProps = {
  initialContent: string;
  initialGrade?: 'junior';
  initialStyle?: 'teacher' | 'kids' | 'exam';
  initialTargetDurationSec?: 30 | 45 | 60;
  initialTaskName?: string;
  initialVoice?: VoiceOption;
  initialSpeechRate?: SpeechRate;
};

const previewVoices: VoiceOption[] = ['female_warm', 'female_clear', 'male_calm'];
const creationSteps: CreationStep[] = [
  {id: 'content', label: '输入题目', meta: '必填', targetId: 'problem-input'},
  {id: 'settings', label: '生成设置', meta: '推荐值', targetId: 'generation-settings'},
  {id: 'voice', label: '配音选择', meta: '可试听', targetId: 'voice-preview'},
  {id: 'review', label: '确认生成', meta: '一键提交', targetId: 'preflight-check'}
];

export function SubmitJobForm({
  initialContent,
  initialGrade = 'junior',
  initialStyle = 'teacher',
  initialTargetDurationSec = 45,
  initialTaskName = '',
  initialVoice,
  initialSpeechRate
}: SubmitJobFormProps) {
  const initialRecommendation = recommendVoicePreset({
    content: initialContent,
    style: initialStyle,
    targetDurationSec: initialTargetDurationSec
  });

  const [content, setContent] = useState(initialContent);
  const [taskName, setTaskName] = useState(initialTaskName);
  const [grade, setGrade] = useState<'junior'>(initialGrade);
  const [targetDurationSec, setTargetDurationSec] = useState<30 | 45 | 60>(initialTargetDurationSec);
  const [style, setStyle] = useState<'teacher' | 'kids' | 'exam'>(initialStyle);
  const [voice, setVoice] = useState<VoiceOption>(initialVoice ?? initialRecommendation.voice);
  const [speechRate, setSpeechRate] = useState<SpeechRate>(initialSpeechRate ?? initialRecommendation.speechRate);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'failed'>('idle');
  const [previewStatus, setPreviewStatus] = useState<'idle' | 'loading' | 'failed'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<VoicePreview[]>([]);

  const recommendation = recommendVoicePreset({content, style, targetDurationSec});
  const trimmedContent = content.trim();
  const trimmedTaskName = taskName.trim();
  const workspaceChecks = useMemo(
    () => [
      {
        done: trimmedContent.length > 0,
        label: '已输入题目内容'
      },
      {
        done: trimmedTaskName.length > 0,
        label: '已填写任务名称'
      },
      {
        done: voice === recommendation.voice && speechRate === recommendation.speechRate,
        label: '已确认推荐配音策略'
      }
    ],
    [recommendation.speechRate, recommendation.voice, speechRate, trimmedContent.length, trimmedTaskName.length, voice]
  );
  const completedCheckCount = workspaceChecks.filter((check) => check.done).length;

  const applyRecommendation = () => {
    setVoice(recommendation.voice);
    setSpeechRate(recommendation.speechRate);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setSubmitError(null);

    try {
      const job = await createJob({
        subject: 'math',
        grade,
        sourceType: 'text',
        ...(trimmedTaskName ? {taskName: trimmedTaskName} : {}),
        content,
        targetDurationSec,
        style,
        voice,
        speechRate
      });

      window.location.assign(`/jobs/${job.jobId}`);
    } catch (error) {
      setSubmitError(formatRequestError(error, 'submit'));
      setStatus('failed');
    }
  };

  const handlePreview = async () => {
    if (!trimmedContent) {
      setPreviews([]);
      setPreviewError('请先输入题目内容，再生成试听。');
      setPreviewStatus('failed');
      return;
    }

    setPreviewStatus('loading');
    setPreviewError(null);

    try {
      const nextPreviews = await Promise.all(
        previewVoices.map(async (previewVoice) => {
          const result = await previewTts({
            text: trimmedContent,
            style,
            targetDurationSec,
            voice: previewVoice,
            speechRate
          });

          return {
            audioUrl: result.audioUrl,
            durationSec: result.durationSec,
            narrationTone: result.narrationTone,
            previewText: result.previewText,
            voice: previewVoice
          };
        })
      );

      setPreviews(nextPreviews);
      setPreviewStatus('idle');
    } catch (error) {
      setPreviews([]);
      setPreviewError(formatRequestError(error, 'preview'));
      setPreviewStatus('failed');
    }
  };

  return (
    <form
      data-form-visual-system="clean-saas"
      data-form-typography="product-editorial"
      data-sketch-form="new-video-draft"
      data-form-shell="professional-workflow"
      onSubmit={handleSubmit}
      style={formStyle}
    >
      <style>{formMotionStyles}</style>
      <StepIndicator completedCount={completedCheckCount} totalCount={workspaceChecks.length} />

      <div data-form-workspace="content-with-preview" style={formWorkspaceStyle}>
        <CreationRail completedCount={completedCheckCount} totalCount={workspaceChecks.length} />

        <div data-form-editing-canvas="lesson-draft" style={formMainColumnStyle}>
          <div style={introCardStyle}>
            <p style={eyebrowStyle}>DRAFT / 新建讲解</p>
            <h2 style={titleStyle}>把题目变成可直接演示的讲解视频</h2>
            <p style={descriptionStyle}>
              输入题目后，系统会自动生成讲解步骤、字幕、配音和动画视频。固定样片会自动带入推荐时长、风格和任务名称。
            </p>
          </div>

      <section data-card-variant="overview-clean" data-form-section="workspace-overview" style={overviewSectionStyle}>
        <SectionHeader
          eyebrow="创作总览"
          title="先确认这次创作的交付方向"
          description="在真正生成前，先快速确认题目、包装方式和默认产出，避免把所有操作堆在一块。"
        />
        <div style={overviewGridStyle}>
          <article style={overviewCardStyle}>
            <span style={overviewLabelStyle}>本次任务</span>
            <strong style={overviewValueStyle}>{trimmedTaskName || '未命名数学题'}</strong>
            <p style={overviewBodyStyle}>
              {trimmedContent ? `${trimmedContent.slice(0, 26)}${trimmedContent.length > 26 ? '…' : ''}` : '等待输入题目内容'}
            </p>
          </article>
          <article style={overviewCardStyle}>
            <span style={overviewLabelStyle}>默认产出</span>
            <strong style={overviewValueStyle}>45 秒竖屏讲解视频</strong>
            <p style={overviewBodyStyle}>可直接交付为视频、字幕、配音和讲解 JSON。</p>
          </article>
          <article style={overviewCardStyle}>
            <span style={overviewLabelStyle}>推荐配音</span>
            <strong style={overviewValueStyle}>{formatVoice(recommendation.voice)}</strong>
            <p style={overviewBodyStyle}>{`${formatSpeechRate(recommendation.speechRate)} · ${recommendation.narrationTone}`}</p>
          </article>
        </div>
      </section>

      <section data-card-variant="section-clean" data-form-section="problem-input" id="problem-input" style={sectionCardStyle}>
        <SectionHeader
          eyebrow="QUESTION / 输入题目"
          title="题目输入"
          description="先确定这次要讲哪道题，以及这条视频在任务列表里如何被识别。"
        />
        <div style={sectionBodyStyle}>
          <label htmlFor="taskName" style={fieldLabelStyle}>
            任务名称
          </label>
          <input
            id="taskName"
            name="taskName"
            placeholder="例如：初一方程例题讲解"
            value={taskName}
            onChange={(event) => setTaskName(event.currentTarget.value)}
            style={textInputStyle}
          />

          <label htmlFor="content" style={fieldLabelStyle}>
            题目内容
          </label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(event) => setContent(event.currentTarget.value)}
            style={textareaStyle}
          />
        </div>
      </section>

      <section data-card-variant="section-clean" data-form-section="generation-settings" id="generation-settings" style={sectionCardStyle}>
        <SectionHeader
          eyebrow="CONFIG / 生成参数"
          title="生成设置"
          description="控制这条视频的目标时长、讲解风格和默认生成参数。"
        />
        <div style={sectionBodyStyle}>
          <div style={optionsGridStyle}>
            <label htmlFor="grade" style={selectLabelStyle}>
              适用年级
              <select
                id="grade"
                name="grade"
                value={grade}
                onChange={(event) => setGrade(event.currentTarget.value as 'junior')}
                style={selectStyle}
              >
                <option value="junior">初中</option>
              </select>
            </label>

            <label htmlFor="targetDurationSec" style={selectLabelStyle}>
              目标时长
              <select
                id="targetDurationSec"
                name="targetDurationSec"
                value={targetDurationSec}
                onChange={(event) => setTargetDurationSec(Number(event.currentTarget.value) as 30 | 45 | 60)}
                style={selectStyle}
              >
                <option value={30}>30 秒</option>
                <option value={45}>45 秒</option>
                <option value={60}>60 秒</option>
              </select>
            </label>

            <label htmlFor="style" style={selectLabelStyle}>
              讲解风格
              <select
                id="style"
                name="style"
                value={style}
                onChange={(event) => setStyle(event.currentTarget.value as 'teacher' | 'kids' | 'exam')}
                style={selectStyle}
              >
                <option value="teacher">老师讲解</option>
                <option value="kids">轻松启发</option>
                <option value="exam">应试提分</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <section data-card-variant="section-clean" data-form-section="voice-preview" id="voice-preview" style={sectionCardStyle}>
        <SectionHeader
          eyebrow="VOICE / 试听配音"
          title="试听与配音选择"
          description="先看系统推荐，再试听三种音色，确认这一题更适合哪种老师声音。"
        />
        <div style={sectionBodyStyle}>
          <section data-card-variant="recommendation-clean" style={recommendationCardStyle}>
            <div style={recommendationHeaderStyle}>
              <div>
                <p style={recommendationEyebrowStyle}>推荐配音</p>
                <strong style={recommendationVoiceStyle}>{formatVoice(recommendation.voice)}</strong>
              </div>
              <button type="button" onClick={applyRecommendation} style={recommendButtonStyle}>
                一键采用推荐音色
              </button>
            </div>
            <div style={recommendationMetaGridStyle}>
              <div style={recommendationMetaItemStyle}>
                <span style={recommendationMetaLabelStyle}>推荐语速</span>
                <strong>{formatSpeechRate(recommendation.speechRate)}</strong>
              </div>
              <div style={recommendationMetaItemStyle}>
                <span style={recommendationMetaLabelStyle}>讲解语气</span>
                <strong>{recommendation.narrationTone}</strong>
              </div>
              <div style={recommendationMetaItemStyle}>
                <span style={recommendationMetaLabelStyle}>封面语气</span>
                <strong>{recommendation.coverTone}</strong>
              </div>
            </div>
            <p style={recommendationReasonStyle}>{recommendation.reason}</p>
          </section>

          <div style={optionsGridStyle}>
            <label htmlFor="voice" style={selectLabelStyle}>
              配音音色
              <select
                id="voice"
                name="voice"
                value={voice}
                onChange={(event) => setVoice(event.currentTarget.value as VoiceOption)}
                style={selectStyle}
              >
                <option value="female_warm">温柔女声</option>
                <option value="female_clear">清晰女声</option>
                <option value="male_calm">沉稳男声</option>
              </select>
            </label>

            <label htmlFor="speechRate" style={selectLabelStyle}>
              配音语速
              <select
                id="speechRate"
                name="speechRate"
                value={speechRate}
                onChange={(event) => setSpeechRate(event.currentTarget.value as SpeechRate)}
                style={selectStyle}
              >
                <option value="slow">慢速</option>
                <option value="normal">正常</option>
                <option value="fast">快速</option>
              </select>
            </label>
          </div>

          <div style={actionsStyle}>
            <LoadingButton
              dataKey="preview-audio"
              isLoading={previewStatus === 'loading'}
              loadingLabel="生成试听中..."
              onClick={() => void handlePreview()}
              style={previewButtonStyle}
              type="button"
            >
              对比三种音色
            </LoadingButton>
            <LoadingButton
              dataKey="generate-video"
              disabled={status === 'submitting'}
              isLoading={status === 'submitting'}
              loadingLabel="正在生成..."
              style={submitButtonStyle}
              type="submit"
            >
              生成视频
            </LoadingButton>
          </div>

          <FormFeedback
            previewError={previewError}
            previewStatus={previewStatus}
            status={status}
            submitError={submitError}
          />

          {previews.length > 0 ? (
            <section style={previewSectionStyle}>
              <p style={previewSectionTitleStyle}>
                {`当前语速：${formatSpeechRate(speechRate)}，先试听哪种老师更适合这道题。`}
              </p>
              <div style={previewGridStyle}>
                {previews.map((preview) => {
                  const selected = preview.voice === voice;
                  const recommended = preview.voice === recommendation.voice;

                  return (
                    <article
                      key={preview.voice}
                      style={{...previewCardStyle, ...(selected ? selectedPreviewCardStyle : {})}}
                    >
                      <div style={previewHeaderStyle}>
                        <div>
                          <strong style={previewVoiceStyle}>{formatVoice(preview.voice)}</strong>
                          <p style={previewMetaStyle}>{`约 ${preview.durationSec} 秒`}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setVoice(preview.voice)}
                          style={selected ? selectedVoiceButtonStyle : selectVoiceButtonStyle}
                        >
                          {selected ? '当前生成音色' : '设为生成音色'}
                        </button>
                      </div>
                      <div style={previewBadgeRowStyle}>
                        {recommended ? <span style={recommendBadgeStyle}>推荐</span> : null}
                        {selected ? <span style={selectedBadgeStyle}>已选中</span> : null}
                      </div>
                      {preview.narrationTone ? <p style={previewScriptStyle}>{preview.narrationTone}</p> : null}
                      {preview.previewText ? <p style={previewQuoteStyle}>{preview.previewText}</p> : null}
                      <audio controls src={preview.audioUrl} style={audioStyle} />
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <section data-card-variant="preflight-clean" data-form-section="preflight-check" id="preflight-check" style={preflightSectionStyle}>
        <SectionHeader
          eyebrow="CHECKLIST / 渲染前检查"
          title="确认这次任务可以顺畅进入渲染"
          description="生成前快速扫一眼，确认题目、任务名和配音策略都已经准备好。"
        />
        <div style={preflightGridStyle}>
          <div style={preflightListStyle}>
            {workspaceChecks.map((check) => (
              <div key={check.label} style={preflightItemStyle}>
                <span style={check.done ? preflightDoneDotStyle : preflightPendingDotStyle} />
                <span style={preflightItemTextStyle}>{check.label}</span>
              </div>
            ))}
          </div>
          <div style={preflightCardStyle}>
            <span style={overviewLabelStyle}>默认产出</span>
            <strong style={overviewValueStyle}>可直接交付</strong>
            <p style={overviewBodyStyle}>视频成片、字幕文件、封面图、讲解 JSON。</p>
          </div>
        </div>
      </section>

        </div>

        <LivePreview
          content={trimmedContent}
          isReady={workspaceChecks.every((check) => check.done)}
          speechRate={speechRate}
          taskName={trimmedTaskName}
          targetDurationSec={targetDurationSec}
          voice={voice}
        />
      </div>

      {status === 'failed' && submitError ? <p role="alert" style={alertStyle}>{submitError}</p> : null}
      {previewStatus === 'failed' && previewError ? <p role="alert" style={alertStyle}>{previewError}</p> : null}
    </form>
  );
}

function LoadingButton({
  children,
  dataKey,
  isLoading,
  loadingLabel,
  style,
  ...buttonProps
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  dataKey: 'preview-audio' | 'generate-video';
  isLoading: boolean;
  loadingLabel: string;
}) {
  return (
    <button
      {...buttonProps}
      aria-busy={isLoading}
      data-loading-button={dataKey}
      disabled={buttonProps.disabled || isLoading}
      style={{...style, ...(isLoading ? loadingButtonStyle : {})}}
    >
      {isLoading ? <span aria-hidden="true" data-loading-spinner="inline" style={spinnerStyle} /> : null}
      {isLoading ? loadingLabel : children}
    </button>
  );
}

function FormFeedback({
  previewError,
  previewStatus,
  status,
  submitError
}: {
  previewError: string | null;
  previewStatus: 'idle' | 'loading' | 'failed';
  status: 'idle' | 'submitting' | 'failed';
  submitError: string | null;
}) {
  const isError = status === 'failed' || previewStatus === 'failed';
  const message =
    status === 'submitting'
      ? '正在创建视频任务，请稍候。'
      : previewStatus === 'loading'
        ? '正在生成试听音频，请稍候。'
        : submitError || previewError || '准备就绪，填写题目后可以试听音色或生成视频。';

  return (
    <div
      aria-live="polite"
      data-form-feedback="operation-status"
      style={isError ? feedbackErrorStyle : feedbackStyle}
    >
      <span style={isError ? feedbackErrorDotStyle : feedbackDotStyle} />
      <p style={feedbackTextStyle}>{message}</p>
    </div>
  );
}

function StepIndicator({completedCount, totalCount}: {completedCount: number; totalCount: number}) {
  return (
    <nav aria-label="表单步骤" data-form-stepper="generation-flow" style={stepperStyle}>
      <div data-step-progress="form-completion" style={stepProgressStyle}>
        <span style={stepProgressLabelStyle}>准备进度</span>
        <strong style={stepProgressValueStyle}>{`${completedCount}/${totalCount} 已完成`}</strong>
      </div>
      <div style={stepperListStyle}>
        {creationSteps.map((step, index) => (
          <a
            data-step-anchor={step.id}
            href={`#${step.targetId}`}
            key={step.id}
            style={stepItemStyle}
          >
            <span style={stepIndexStyle}>{index + 1}</span>
            <span style={stepTextStyle}>
              <strong style={stepLabelStyle}>{step.label}</strong>
              <span style={stepMetaStyle}>{step.meta}</span>
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function CreationRail({completedCount, totalCount}: {completedCount: number; totalCount: number}) {
  return (
    <aside data-form-rail="creation-steps" style={creationRailStyle}>
      <div style={creationRailHeaderStyle}>
        <p style={creationRailEyebrowStyle}>CREATION FLOW</p>
        <h3 style={creationRailTitleStyle}>按步骤完成一条讲解视频</h3>
        <p style={creationRailBodyStyle}>当前已完成 {completedCount}/{totalCount} 项准备检查。</p>
      </div>
      <div style={creationRailListStyle}>
        {creationSteps.map((step, index) => (
          <a href={`#${step.targetId}`} key={step.id} style={creationRailItemStyle}>
            <span style={creationRailIndexStyle}>{index + 1}</span>
            <span style={creationRailTextStyle}>
              <strong style={creationRailLabelStyle}>{step.label}</strong>
              <span style={creationRailMetaStyle}>{step.meta}</span>
            </span>
          </a>
        ))}
      </div>
    </aside>
  );
}

function LivePreview({
  content,
  isReady,
  speechRate,
  taskName,
  targetDurationSec,
  voice
}: {
  content: string;
  isReady: boolean;
  speechRate: SpeechRate;
  taskName: string;
  targetDurationSec: 30 | 45 | 60;
  voice: VoiceOption;
}) {
  return (
    <aside data-form-preview="live-summary" style={livePreviewStyle}>
      <span style={createBadgeStyleV2(isReady ? 'success' : 'warning')}>
        {isReady ? '填写完整，可以生成' : '仍需确认'}
      </span>
      <div style={livePreviewHeaderStyle}>
        <p style={livePreviewKickerStyle}>LIVE PREVIEW</p>
        <h3 style={livePreviewTitleStyle}>实时预览</h3>
        <p style={livePreviewBodyStyle}>右侧会随着题目、任务名和配音策略实时更新，帮助老师在提交前快速确认。</p>
      </div>
      <div style={livePreviewListStyle}>
        <PreviewRow label="任务名称" value={taskName || '未填写任务名称'} />
        <PreviewRow label="题目内容" value={content ? `${content.slice(0, 48)}${content.length > 48 ? '…' : ''}` : '等待输入题目'} />
        <PreviewRow label="预计产出" value={`${targetDurationSec} 秒竖屏视频 + 字幕 + 配音`} />
        <PreviewRow label="配音策略" value={`${formatVoice(voice)} · ${formatSpeechRate(speechRate)}`} />
      </div>
    </aside>
  );
}

function PreviewRow({label, value}: {label: string; value: string}) {
  return (
    <div style={previewRowStyle}>
      <span style={previewRowLabelStyle}>{label}</span>
      <strong style={previewRowValueStyle}>{value}</strong>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header style={sectionHeaderStyle}>
      <p style={sectionEyebrowStyle}>{eyebrow}</p>
      <h3 style={sectionTitleStyle}>{title}</h3>
      <p style={sectionDescriptionStyle}>{description}</p>
    </header>
  );
}

const formStyle = {
  display: 'grid',
  gap: designTokens.spacing[5],
  position: 'relative' as const
};

const formWorkspaceStyle = {
  alignItems: 'start',
  display: 'grid',
  gap: designTokens.spacing[6],
  gridTemplateColumns: 'minmax(190px, 230px) minmax(0, 1fr) minmax(260px, 340px)'
};

const formMainColumnStyle = {
  display: 'grid',
  gap: designTokens.spacing[5],
  minWidth: 0
};

const stepperStyle = {
  ...createCardStyleV2('low'),
  display: 'grid',
  gap: designTokens.spacing[3],
  padding: designTokens.spacing[4]
};

const stepProgressStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: designTokens.spacing[2],
  justifyContent: 'space-between'
};

const stepProgressLabelStyle = {
  color: designTokens.colors.neutral[500],
  fontSize: designTokens.fontSize.xs,
  fontWeight: designTokens.fontWeight.semibold,
  letterSpacing: '0.08em'
};

const stepProgressValueStyle = {
  color: designTokens.colors.brand.primary,
  fontSize: designTokens.fontSize.sm
};

const stepperListStyle = {
  alignItems: 'center',
  display: 'grid',
  gap: designTokens.spacing[3],
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))'
};

const stepItemStyle = {
  alignItems: 'center',
  color: 'inherit',
  display: 'flex',
  gap: designTokens.spacing[3],
  textDecoration: 'none'
};

const stepIndexStyle = {
  alignItems: 'center',
  background: designTokens.colors.brand.primary,
  borderRadius: designTokens.borderRadius.full,
  color: '#fff',
  display: 'inline-flex',
  flexShrink: 0,
  fontSize: designTokens.fontSize.sm,
  fontWeight: designTokens.fontWeight.bold,
  height: 34,
  justifyContent: 'center',
  width: 34
};

const stepTextStyle = {
  display: 'grid',
  gap: 2
};

const stepLabelStyle = {
  color: designTokens.colors.neutral[900],
  fontSize: designTokens.fontSize.sm
};

const stepMetaStyle = {
  color: designTokens.colors.neutral[500],
  fontSize: designTokens.fontSize.xs
};

const creationRailStyle = {
  ...createCardStyleV2('low'),
  gap: designTokens.spacing[5],
  position: 'sticky' as const,
  top: 24
};

const creationRailHeaderStyle = {
  display: 'grid',
  gap: designTokens.spacing[2]
};

const creationRailEyebrowStyle = {
  color: designTokens.colors.brand.primary,
  fontFamily: designTokens.fonts.mono,
  fontSize: designTokens.fontSize.xs,
  fontWeight: designTokens.fontWeight.extrabold,
  letterSpacing: '0.12em',
  margin: 0
};

const creationRailTitleStyle = {
  color: designTokens.colors.neutral[900],
  fontSize: designTokens.fontSize.lg,
  lineHeight: designTokens.lineHeight.tight,
  margin: 0
};

const creationRailBodyStyle = {
  color: designTokens.colors.neutral[600],
  fontSize: designTokens.fontSize.sm,
  lineHeight: designTokens.lineHeight.relaxed,
  margin: 0
};

const creationRailListStyle = {
  display: 'grid',
  gap: designTokens.spacing[3]
};

const creationRailItemStyle = {
  alignItems: 'center',
  background: designTokens.colors.neutral[50],
  border: `1px solid ${designTokens.colors.neutral[200]}`,
  borderRadius: designTokens.borderRadius.lg,
  color: 'inherit',
  display: 'flex',
  gap: designTokens.spacing[3],
  padding: designTokens.spacing[3],
  textDecoration: 'none'
};

const creationRailIndexStyle = {
  alignItems: 'center',
  background: designTokens.colors.brand.primary,
  borderRadius: designTokens.borderRadius.full,
  color: '#fff',
  display: 'inline-flex',
  flexShrink: 0,
  fontSize: designTokens.fontSize.xs,
  fontWeight: designTokens.fontWeight.bold,
  height: 28,
  justifyContent: 'center',
  width: 28
};

const creationRailTextStyle = {
  display: 'grid',
  gap: 2
};

const creationRailLabelStyle = {
  color: designTokens.colors.neutral[900],
  fontSize: designTokens.fontSize.sm
};

const creationRailMetaStyle = {
  color: designTokens.colors.neutral[500],
  fontSize: designTokens.fontSize.xs
};

const livePreviewStyle = {
  ...createCardStyleV2('medium'),
  gap: designTokens.spacing[5],
  position: 'sticky' as const,
  top: 24
};

const livePreviewHeaderStyle = {
  display: 'grid',
  gap: designTokens.spacing[2]
};

const livePreviewKickerStyle = {
  color: designTokens.colors.brand.primary,
  fontFamily: designTokens.fonts.mono,
  fontSize: designTokens.fontSize.xs,
  fontWeight: designTokens.fontWeight.extrabold,
  letterSpacing: '0.12em',
  margin: 0
};

const livePreviewTitleStyle = {
  color: designTokens.colors.neutral[900],
  fontFamily: designTokens.fonts.sans,
  fontSize: designTokens.fontSize['2xl'],
  lineHeight: designTokens.lineHeight.tight,
  margin: 0
};

const livePreviewBodyStyle = {
  color: designTokens.colors.neutral[600],
  lineHeight: designTokens.lineHeight.relaxed,
  margin: 0
};

const livePreviewListStyle = {
  display: 'grid',
  gap: designTokens.spacing[3]
};

const previewRowStyle = {
  background: designTokens.colors.neutral[50],
  border: `1px solid ${designTokens.colors.neutral[200]}`,
  borderRadius: designTokens.borderRadius.lg,
  display: 'grid',
  gap: designTokens.spacing[1],
  padding: designTokens.spacing[3]
};

const previewRowLabelStyle = {
  color: designTokens.colors.neutral[500],
  fontSize: designTokens.fontSize.xs,
  fontWeight: designTokens.fontWeight.semibold
};

const previewRowValueStyle = {
  color: designTokens.colors.neutral[800],
  fontSize: designTokens.fontSize.sm,
  lineHeight: designTokens.lineHeight.snug
};

const introCardStyle = {
  background: `linear-gradient(135deg, ${designTokens.colors.neutral[50]}, ${designTokens.colors.warning.bg})`,
  border: `1px solid ${designTokens.colors.neutral[200]}`,
  borderRadius: designTokens.borderRadius.xl,
  boxShadow: designTokens.shadows.md,
  display: 'grid',
  gap: designTokens.spacing[2],
  padding: designTokens.spacing[6]
};

const eyebrowStyle = {
  ...createSketchEyebrowStyle(),
  fontFamily: 'Consolas, "Courier New", monospace',
  letterSpacing: 2
};

const titleStyle = {
  color: designTokens.colors.neutral[900],
  fontFamily:
    '"Avenir Next", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  fontSize: 30,
  fontWeight: designTokens.fontWeight.extrabold,
  letterSpacing: '-0.03em',
  lineHeight: 1.18,
  margin: 0
};

const descriptionStyle = {
  color: designTokens.colors.neutral[600],
  lineHeight: designTokens.lineHeight.relaxed,
  margin: 0
};

const overviewSectionStyle = {
  ...createCardStyleV2('medium'),
  gap: designTokens.spacing[4],
  padding: designTokens.spacing[5]
};

const overviewGridStyle = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
};

const overviewCardStyle = {
  background: designTokens.colors.neutral[50],
  border: `1px solid ${designTokens.colors.neutral[200]}`,
  borderRadius: designTokens.borderRadius.lg,
  display: 'grid',
  gap: designTokens.spacing[2],
  padding: designTokens.spacing[4]
};

const overviewLabelStyle = {
  color: sketchColors.accent,
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.4
};

const overviewValueStyle = {
  color: sketchColors.ink,
  fontSize: 20,
  lineHeight: 1.3
};

const overviewBodyStyle = {
  color: sketchColors.muted,
  lineHeight: 1.6,
  margin: 0
};

const sectionCardStyle = {
  ...createCardStyleV2('medium'),
  display: 'grid',
  gap: designTokens.spacing[4],
  padding: designTokens.spacing[5]
};

const sectionHeaderStyle = {
  display: 'grid',
  gap: 6
};

const sectionEyebrowStyle = {
  color: sketchColors.accent,
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 2,
  margin: 0
};

const sectionTitleStyle = {
  color: designTokens.colors.neutral[900],
  fontFamily:
    '"Avenir Next", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  fontSize: designTokens.fontSize.xl,
  fontWeight: designTokens.fontWeight.bold,
  letterSpacing: '-0.02em',
  lineHeight: designTokens.lineHeight.tight,
  margin: 0
};

const sectionDescriptionStyle = {
  color: designTokens.colors.neutral[600],
  lineHeight: designTokens.lineHeight.relaxed,
  margin: 0
};

const sectionBodyStyle = {
  display: 'grid',
  gap: 14
};

const fieldLabelStyle = {
  ...createLabelStyleV2(),
  color: designTokens.colors.neutral[800],
  fontWeight: designTokens.fontWeight.semibold,
  letterSpacing: 0.2
};

const textInputStyle = {
  ...createInputStyleV2(),
  boxShadow: designTokens.shadows.inner
};

const textareaStyle = {
  ...textInputStyle,
  minHeight: 128,
  resize: 'vertical' as const
};

const optionsGridStyle = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
};

const selectLabelStyle = {
  color: designTokens.colors.neutral[800],
  display: 'grid',
  fontSize: designTokens.fontSize.sm,
  fontWeight: designTokens.fontWeight.semibold,
  gap: 8
};

const selectStyle = {
  ...createInputStyleV2(),
  cursor: 'pointer'
};

const recommendationCardStyle = {
  background: `linear-gradient(135deg, ${designTokens.colors.warning.bg}, ${designTokens.colors.neutral[50]})`,
  border: `1px solid ${designTokens.colors.warning.light}`,
  borderRadius: designTokens.borderRadius.xl,
  boxShadow: designTokens.shadows.sm,
  display: 'grid',
  gap: designTokens.spacing[3],
  padding: designTokens.spacing[4]
};

const recommendationHeaderStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: 12,
  justifyContent: 'space-between'
};

const recommendationEyebrowStyle = {
  color: sketchColors.accent,
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.8,
  margin: 0
};

const recommendationVoiceStyle = {
  color: sketchColors.ink,
  display: 'block',
  fontSize: 20
};

const recommendationReasonStyle = {
  color: sketchColors.ink,
  lineHeight: 1.6,
  margin: 0
};

const recommendationMetaGridStyle = {
  display: 'grid',
  gap: 10,
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'
};

const recommendationMetaItemStyle = {
  background: 'rgba(255,255,255,0.72)',
  border: `1px solid ${designTokens.colors.neutral[200]}`,
  borderRadius: designTokens.borderRadius.lg,
  display: 'grid',
  gap: 4,
  padding: 12
};

const recommendationMetaLabelStyle = {
  color: '#6f665b',
  fontSize: 12,
  fontWeight: 700
};

const recommendButtonStyle = {
  ...createButtonStyleV2('outline', 'sm')
};

const actionsStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 12
};

const previewButtonStyle = {
  ...createButtonStyleV2('outline', 'md')
};

const submitButtonStyle = {
  ...createButtonStyleV2('primary', 'md'),
  fontWeight: 900
};

const loadingButtonStyle = {
  opacity: 0.82,
  pointerEvents: 'none' as const
};

const spinnerStyle = {
  animation: 'buttonSpinner 800ms linear infinite',
  border: '2px solid currentColor',
  borderRightColor: 'transparent',
  borderRadius: designTokens.borderRadius.full,
  display: 'inline-flex',
  height: 14,
  marginRight: 8,
  width: 14
};

const feedbackStyle = {
  alignItems: 'center',
  background: designTokens.colors.neutral[50],
  border: `1px solid ${designTokens.colors.neutral[200]}`,
  borderRadius: designTokens.borderRadius.lg,
  color: designTokens.colors.neutral[700],
  display: 'flex',
  gap: designTokens.spacing[3],
  padding: designTokens.spacing[3]
};

const feedbackErrorStyle = {
  ...feedbackStyle,
  background: designTokens.colors.error.bg,
  border: `1px solid ${designTokens.colors.error.light}`,
  color: designTokens.colors.error.dark
};

const feedbackDotStyle = {
  background: designTokens.colors.success.main,
  borderRadius: designTokens.borderRadius.full,
  flexShrink: 0,
  height: 10,
  width: 10
};

const feedbackErrorDotStyle = {
  ...feedbackDotStyle,
  background: designTokens.colors.error.main
};

const feedbackTextStyle = {
  fontSize: designTokens.fontSize.sm,
  lineHeight: designTokens.lineHeight.snug,
  margin: 0
};

const previewSectionStyle = {
  ...createSketchCardStyle({tone: 'paper'}),
  boxShadow: undefined,
  gap: 14,
  padding: 16
};

const previewSectionTitleStyle = {
  color: '#374151',
  margin: 0
};

const previewGridStyle = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
};

const previewCardStyle = {
  ...createSketchCardStyle(),
  borderWidth: 2,
  boxShadow: undefined,
  gap: 12,
  padding: 14
};

const selectedPreviewCardStyle = {
  border: '1px solid #6f7d45',
  boxShadow: '0 0 0 1px rgba(111, 125, 69, 0.12)'
};

const previewHeaderStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: 12,
  justifyContent: 'space-between'
};

const previewVoiceStyle = {
  color: '#1f2937',
  display: 'block'
};

const previewMetaStyle = {
  color: '#6b7280',
  fontSize: 13,
  margin: '4px 0 0'
};

const previewScriptStyle = {
  color: '#1f5134',
  fontSize: 13,
  fontWeight: 700,
  margin: 0
};

const previewQuoteStyle = {
  color: '#374151',
  fontSize: 13,
  lineHeight: 1.6,
  margin: 0
};

const previewBadgeRowStyle = {
  display: 'flex',
  gap: 8
};

const recommendBadgeStyle = {
  ...createSketchPillStyle({tone: 'success'}),
  fontWeight: 700,
  padding: '4px 10px'
};

const selectedBadgeStyle = {
  ...createSketchPillStyle({tone: 'dark'}),
  fontWeight: 700,
  padding: '4px 10px'
};

const selectVoiceButtonStyle = {
  ...createSketchButtonStyle({tone: 'quiet'}),
  padding: '8px 12px'
};

const selectedVoiceButtonStyle = {
  ...createSketchButtonStyle({tone: 'dark'}),
  padding: '8px 12px'
};

const audioStyle = {
  width: '100%'
};

const preflightSectionStyle = {
  ...createCardStyleV2('medium'),
  display: 'grid',
  gap: designTokens.spacing[4],
  padding: designTokens.spacing[5]
};

const preflightGridStyle = {
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'minmax(0, 1.2fr) minmax(220px, 0.8fr)'
};

const preflightListStyle = {
  display: 'grid',
  gap: 10
};

const preflightItemStyle = {
  alignItems: 'center',
  background: designTokens.colors.neutral[50],
  border: `1px solid ${designTokens.colors.neutral[200]}`,
  borderRadius: designTokens.borderRadius.lg,
  display: 'flex',
  gap: 10,
  padding: '12px 14px'
};

const preflightDoneDotStyle = {
  background: sketchColors.accent,
  borderRadius: 999,
  display: 'inline-flex',
  height: 10,
  width: 10
};

const preflightPendingDotStyle = {
  background: '#d7c8a9',
  borderRadius: 999,
  display: 'inline-flex',
  height: 10,
  width: 10
};

const preflightItemTextStyle = {
  color: sketchColors.ink,
  fontSize: 14,
  fontWeight: 700
};

const preflightCardStyle = {
  background: designTokens.colors.warning.bg,
  border: `1px solid ${designTokens.colors.warning.light}`,
  borderRadius: designTokens.borderRadius.xl,
  color: designTokens.colors.neutral[900],
  display: 'grid',
  gap: 8,
  padding: 16
};

const alertStyle = {
  background: designTokens.colors.error.bg,
  border: `1px solid ${designTokens.colors.error.light}`,
  borderRadius: designTokens.borderRadius.lg,
  color: designTokens.colors.error.dark,
  margin: 0,
  padding: designTokens.spacing[4]
};

const formMotionStyles = `
  ${keyframesV2}

  @keyframes buttonSpinner {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 960px) {
    [data-form-workspace="content-with-preview"] {
      grid-template-columns: minmax(0, 1fr) !important;
    }

    [data-form-preview="live-summary"] {
      position: static !important;
    }

    [data-form-rail="creation-steps"] {
      position: static !important;
    }
  }
`;

const formatVoice = (voice: VoiceOption) => {
  const labels: Record<VoiceOption, string> = {
    female_clear: '清晰女声',
    female_warm: '温柔女声',
    male_calm: '沉稳男声'
  };

  return labels[voice];
};

const formatSpeechRate = (speechRate: SpeechRate) => {
  const labels: Record<SpeechRate, string> = {
    fast: '快速',
    normal: '正常',
    slow: '慢速'
  };

  return labels[speechRate];
};

const formatRequestError = (error: unknown, action: 'submit' | 'preview') => {
  const fallback =
    action === 'submit' ? '视频生成失败，请稍后重试。' : '音色试听生成失败，请稍后重试。';

  if (!(error instanceof Error)) {
    return fallback;
  }

  if (error.message === 'API_UNREACHABLE') {
    return '后端服务未连接，请先启动 API（默认端口 3001）后再重试。';
  }

  return error.message.trim() || fallback;
};
