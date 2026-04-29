'use client';

import React, {FormEvent, useState} from 'react';

import {createJob, previewTts} from '../lib/api-client';
import {recommendVoicePreset} from './voice-recommendation';

type VoiceOption = 'female_warm' | 'female_clear' | 'male_calm';
type SpeechRate = 'slow' | 'normal' | 'fast';

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
  const [speechRate, setSpeechRate] = useState<SpeechRate>(
    initialSpeechRate ?? initialRecommendation.speechRate
  );
  const [status, setStatus] = useState<'idle' | 'submitting' | 'failed'>('idle');
  const [previewStatus, setPreviewStatus] = useState<'idle' | 'loading' | 'failed'>('idle');
  const [previews, setPreviews] = useState<VoicePreview[]>([]);

  const recommendation = recommendVoicePreset({content, style, targetDurationSec});

  const applyRecommendation = () => {
    setVoice(recommendation.voice);
    setSpeechRate(recommendation.speechRate);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');

    try {
      const trimmedTaskName = taskName.trim();
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
    } catch {
      setStatus('failed');
    }
  };

  const handlePreview = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setPreviews([]);
      setPreviewStatus('failed');
      return;
    }

    setPreviewStatus('loading');

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
    } catch {
      setPreviews([]);
      setPreviewStatus('failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={introCardStyle}>
        <p style={eyebrowStyle}>开始生成</p>
        <h2 style={titleStyle}>把题目变成可直接演示的讲解视频</h2>
        <p style={descriptionStyle}>
          输入题目后，系统会自动生成讲解步骤、字幕、配音和动画视频。固定样片会自动带入推荐时长、风格和任务名称。
        </p>
      </div>

      <section data-form-section="problem-input" style={sectionCardStyle}>
        <SectionHeader
          eyebrow="第一步"
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

      <section data-form-section="generation-settings" style={sectionCardStyle}>
        <SectionHeader
          eyebrow="第二步"
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
                onChange={(event) =>
                  setTargetDurationSec(Number(event.currentTarget.value) as 30 | 45 | 60)
                }
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

      <section data-form-section="voice-preview" style={sectionCardStyle}>
        <SectionHeader
          eyebrow="第三步"
          title="试听与配音选择"
          description="先看系统推荐，再试听三种音色，确认这一题更适合哪种老师声音。"
        />
        <div style={sectionBodyStyle}>
          <section style={recommendationCardStyle}>
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
            <button type="button" onClick={() => void handlePreview()} style={previewButtonStyle}>
              {previewStatus === 'loading' ? '生成试听中...' : '对比三种音色'}
            </button>
            <button type="submit" disabled={status === 'submitting'} style={submitButtonStyle}>
              {status === 'submitting' ? '正在生成...' : '生成视频'}
            </button>
          </div>

          {previews.length > 0 ? (
            <section style={previewSectionStyle}>
              <p style={previewSectionTitleStyle}>
                {`当前语速：${formatSpeechRate(speechRate)}，先听听哪种老师更适合这道题。`}
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

      {status === 'failed' ? <p role="alert">创建任务失败，请稍后重试。</p> : null}
      {previewStatus === 'failed' ? <p role="alert">试听生成失败，请检查题目内容后重试。</p> : null}
    </form>
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
  gap: 16
};

const introCardStyle = {
  background: 'linear-gradient(135deg, #FFF7D6 0%, #FFFFFF 100%)',
  border: '1px solid #eadfca',
  borderRadius: 20,
  display: 'grid',
  gap: 8,
  padding: 18
};

const eyebrowStyle = {
  color: '#6f7d45',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 1.4,
  margin: 0
};

const titleStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 28,
  lineHeight: 1.15,
  margin: 0
};

const descriptionStyle = {
  color: '#374151',
  lineHeight: 1.7,
  margin: 0
};

const sectionCardStyle = {
  background: '#fffdf8',
  border: '1px solid #eadfca',
  borderRadius: 22,
  display: 'grid',
  gap: 16,
  padding: 18
};

const sectionHeaderStyle = {
  display: 'grid',
  gap: 6
};

const sectionEyebrowStyle = {
  color: '#6f7d45',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.2,
  margin: 0
};

const sectionTitleStyle = {
  color: '#102A43',
  fontSize: 24,
  lineHeight: 1.2,
  margin: 0
};

const sectionDescriptionStyle = {
  color: '#4b5563',
  lineHeight: 1.65,
  margin: 0
};

const sectionBodyStyle = {
  display: 'grid',
  gap: 14
};

const fieldLabelStyle = {
  color: '#1f2937',
  fontSize: 14,
  fontWeight: 700
};

const textInputStyle = {
  border: '1px solid #d7c8a9',
  borderRadius: 14,
  fontSize: 15,
  padding: '12px 14px'
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
  color: '#1f2937',
  display: 'grid',
  fontSize: 14,
  fontWeight: 700,
  gap: 8
};

const selectStyle = {
  border: '1px solid #d7c8a9',
  borderRadius: 14,
  fontSize: 15,
  padding: '12px 14px'
};

const recommendationCardStyle = {
  background: 'linear-gradient(135deg, #fffaf1 0%, #f4efe2 100%)',
  border: '1px solid #eadfca',
  borderRadius: 18,
  display: 'grid',
  gap: 10,
  padding: 16
};

const recommendationHeaderStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: 12,
  justifyContent: 'space-between'
};

const recommendationEyebrowStyle = {
  color: '#6f7d45',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1.2,
  margin: 0
};

const recommendationVoiceStyle = {
  color: '#1f2937',
  display: 'block',
  fontSize: 20
};

const recommendationReasonStyle = {
  color: '#374151',
  lineHeight: 1.6,
  margin: 0
};

const recommendationMetaGridStyle = {
  display: 'grid',
  gap: 10,
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))'
};

const recommendationMetaItemStyle = {
  background: 'rgba(255, 255, 255, 0.72)',
  border: '1px solid #eadfca',
  borderRadius: 14,
  display: 'grid',
  gap: 4,
  padding: 12
};

const recommendationMetaLabelStyle = {
  color: '#6b7280',
  fontSize: 12,
  fontWeight: 700
};

const recommendButtonStyle = {
  background: '#6f7d45',
  border: '1px solid #6f7d45',
  borderRadius: 999,
  color: '#ffffff',
  cursor: 'pointer',
  padding: '8px 12px'
};

const actionsStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 12
};

const previewButtonStyle = {
  background: '#fff7d6',
  border: '1px solid #eadfca',
  borderRadius: 999,
  color: '#1f2937',
  cursor: 'pointer',
  padding: '10px 16px'
};

const submitButtonStyle = {
  background: '#102A43',
  border: '1px solid #102A43',
  borderRadius: 999,
  color: '#ffffff',
  cursor: 'pointer',
  padding: '10px 18px'
};

const previewSectionStyle = {
  background: '#fffaf1',
  border: '1px solid #eadfca',
  borderRadius: 18,
  display: 'grid',
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
  background: '#ffffff',
  border: '1px solid #eadfca',
  borderRadius: 14,
  display: 'grid',
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
  background: '#f5efe2',
  borderRadius: 999,
  color: '#6f7d45',
  display: 'inline-flex',
  fontSize: 12,
  fontWeight: 700,
  padding: '4px 10px'
};

const selectedBadgeStyle = {
  background: '#6f7d45',
  borderRadius: 999,
  color: '#ffffff',
  display: 'inline-flex',
  fontSize: 12,
  fontWeight: 700,
  padding: '4px 10px'
};

const selectVoiceButtonStyle = {
  background: '#f5efe2',
  border: '1px solid #eadfca',
  borderRadius: 999,
  color: '#1f2937',
  cursor: 'pointer',
  padding: '8px 12px'
};

const selectedVoiceButtonStyle = {
  ...selectVoiceButtonStyle,
  background: '#6f7d45',
  border: '1px solid #6f7d45',
  color: '#ffffff'
};

const audioStyle = {
  width: '100%'
};

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
