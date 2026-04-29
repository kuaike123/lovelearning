'use client';

import React, {FormEvent, useState} from 'react';

import {createJob, previewTts} from '../lib/api-client';
import {recommendVoicePreset} from './voice-recommendation';

type VoiceOption = 'female_warm' | 'female_clear' | 'male_calm';
type SpeechRate = 'slow' | 'normal' | 'fast';

type VoicePreview = {
  audioUrl: string;
  durationSec: number;
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
            voice: previewVoice,
            speechRate
          });

          return {
            audioUrl: result.audioUrl,
            durationSec: result.durationSec,
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

      <label htmlFor="taskName">任务名称</label>
      <input
        id="taskName"
        name="taskName"
        placeholder="例如：初一方程例题讲解"
        value={taskName}
        onChange={(event: {currentTarget: {value: string}}) => setTaskName(event.currentTarget.value)}
      />

      <label htmlFor="content">题目内容</label>
      <textarea
        id="content"
        name="content"
        value={content}
        onChange={(event: {currentTarget: {value: string}}) => setContent(event.currentTarget.value)}
      />

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
        <label htmlFor="grade">
          适用年级
          <select
            id="grade"
            name="grade"
            value={grade}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setGrade(event.currentTarget.value as 'junior')
            }
          >
            <option value="junior">初中</option>
          </select>
        </label>

        <label htmlFor="targetDurationSec">
          目标时长
          <select
            id="targetDurationSec"
            name="targetDurationSec"
            value={targetDurationSec}
            onChange={(event: {currentTarget: {value: string}}) =>
              setTargetDurationSec(Number(event.currentTarget.value) as 30 | 45 | 60)
            }
          >
            <option value={30}>30 秒</option>
            <option value={45}>45 秒</option>
            <option value={60}>60 秒</option>
          </select>
        </label>

        <label htmlFor="style">
          讲解风格
          <select
            id="style"
            name="style"
            value={style}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setStyle(event.currentTarget.value as 'teacher' | 'kids' | 'exam')
            }
          >
            <option value="teacher">老师讲解</option>
            <option value="kids">轻松启发</option>
            <option value="exam">应试提分</option>
          </select>
        </label>

        <label htmlFor="voice">
          配音音色
          <select
            id="voice"
            name="voice"
            value={voice}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setVoice(event.currentTarget.value as VoiceOption)
            }
          >
            <option value="female_warm">温柔女声</option>
            <option value="female_clear">清晰女声</option>
            <option value="male_calm">沉稳男声</option>
          </select>
        </label>

        <label htmlFor="speechRate">
          配音语速
          <select
            id="speechRate"
            name="speechRate"
            value={speechRate}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              setSpeechRate(event.currentTarget.value as SpeechRate)
            }
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
        <button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? '正在生成...' : '生成视频'}
        </button>
      </div>

      {previews.length > 0 ? (
        <section style={previewSectionStyle}>
          <p style={previewSectionTitleStyle}>{`当前语速：${formatSpeechRate(speechRate)}，先听听哪种老师更适合这道题。`}</p>
          <div style={previewGridStyle}>
            {previews.map((preview) => {
              const selected = preview.voice === voice;
              const recommended = preview.voice === recommendation.voice;

              return (
                <article key={preview.voice} style={{...previewCardStyle, ...(selected ? selectedPreviewCardStyle : {})}}>
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
                  <audio controls src={preview.audioUrl} style={audioStyle} />
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {status === 'failed' ? <p role="alert">创建任务失败，请稍后重试</p> : null}
      {previewStatus === 'failed' ? <p role="alert">试听生成失败，请检查题目内容后重试</p> : null}
    </form>
  );
}

const formStyle = {
  display: 'grid',
  gap: 12
};

const introCardStyle = {
  background: 'linear-gradient(135deg, #FFF7D6 0%, #FFFFFF 100%)',
  border: '1px solid #eadfca',
  borderRadius: 20,
  display: 'grid',
  gap: 8,
  marginBottom: 8,
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

const optionsGridStyle = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  margin: '16px 0'
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
