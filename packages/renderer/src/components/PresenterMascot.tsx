import React from 'react';

import {getPresenterTargetForCue, type PresenterTeachingCue, type PresenterTeachingTarget} from '../lib/presenter-cues';

export type PresenterState = 'idle_teach' | 'welcome_wave' | 'point_explain' | 'warning_alert' | 'summary_cheer';
export type PresenterSpeechActivity = 'resting' | 'speaking';
export type PresenterSpeechWindow = {
  end: number;
  start: number;
};

type PresenterMascotProps = {
  sceneProgress?: number;
  sceneType: string;
  speechActivity?: PresenterSpeechActivity;
  speechWindows?: PresenterSpeechWindow[];
  state?: PresenterState;
  teachingCue?: PresenterTeachingCue;
  teachingTarget?: PresenterTeachingTarget;
};

const sceneStateMap: Record<string, PresenterState> = {
  problem: 'idle_teach',
  step: 'point_explain',
  summary: 'summary_cheer',
  title: 'welcome_wave',
  warning: 'warning_alert'
};

const stateCopy: Record<PresenterState, {badge: string; label: string; rotation: number}> = {
  idle_teach: {
    badge: '\u966a\u4f60\u8bfb\u9898',
    label: '\u5c0f\u718a\u732b\u8001\u5e08',
    rotation: -2
  },
  point_explain: {
    badge: '\u6307\u5411\u91cd\u70b9',
    label: '\u5c0f\u718a\u732b\u8001\u5e08',
    rotation: 2
  },
  summary_cheer: {
    badge: '\u603b\u7ed3\u9f13\u52b1',
    label: '\u5c0f\u718a\u732b\u8001\u5e08',
    rotation: -1
  },
  warning_alert: {
    badge: '\u6613\u9519\u63d0\u9192',
    label: '\u5c0f\u718a\u732b\u8001\u5e08',
    rotation: 4
  },
  welcome_wave: {
    badge: '\u6b22\u8fce\u5f00\u8bb2',
    label: '\u5c0f\u718a\u732b\u8001\u5e08',
    rotation: -4
  }
};

const teachingCueCopy: Record<PresenterTeachingCue, string> = {
  diagram_pointer: '\u6307\u5411\u56fe\u5f62\u5173\u952e\u70b9',
  formula_pointer: '\u6307\u5411\u516c\u5f0f\u677f\u4e66',
  none: '\u966a\u4f34\u8bb2\u89e3',
  reading_guide: '\u5e26\u7740\u5708\u51fa\u9898\u5e72',
  summary_reward: '\u9f13\u52b1\u5b8c\u6210\u5b66\u4e60',
  warning_flash: '\u9ad8\u4eae\u6613\u9519\u70b9'
};

const teachingTargetCopy: Record<PresenterTeachingTarget, string> = {
  comparison_card: '\u7bad\u5934\u6307\u5411\u6613\u9519\u5bf9\u6bd4\u533a',
  diagram_area: '\u7bad\u5934\u6307\u5411\u56fe\u5f62\u533a',
  formula_board: '\u7bad\u5934\u6307\u5411\u516c\u5f0f\u677f\u4e66\u533a',
  none: '\u65e0\u6307\u5411\u533a\u57df',
  problem_keywords: '\u7bad\u5934\u6307\u5411\u9898\u5e72\u5173\u952e\u8bcd\u533a',
  summary_answer: '\u7bad\u5934\u6307\u5411\u7b54\u6848\u603b\u7ed3\u533a'
};

export const getPresenterStateForScene = (sceneType: string): PresenterState => {
  return sceneStateMap[sceneType] ?? 'idle_teach';
};

const clampProgress = (progress: number | undefined) => {
  if (typeof progress !== 'number' || Number.isNaN(progress)) return 0;

  return Math.max(0, Math.min(1, progress));
};

export const isProgressInsideSpeechWindow = (progress: number, speechWindows?: PresenterSpeechWindow[]) => {
  if (!speechWindows?.length) return true;

  return speechWindows.some((window) => progress >= window.start && progress <= window.end);
};

export const PresenterMascot: React.FC<PresenterMascotProps> = ({
  sceneProgress,
  sceneType,
  speechActivity = 'resting',
  speechWindows,
  state,
  teachingCue = 'none',
  teachingTarget
}) => {
  const presenterState = state ?? getPresenterStateForScene(sceneType);
  const copy = stateCopy[presenterState];
  const cueLabel = teachingCueCopy[teachingCue];
  const target = teachingTarget ?? getPresenterTargetForCue(teachingCue);
  const targetLabel = teachingTargetCopy[target];
  const progress = clampProgress(sceneProgress);
  const phase = progress * Math.PI * 2;
  const floatY = Math.sin(phase * 2) * 5;
  const blinkScale = progress > 0.18 && progress < 0.24 ? 0.16 : progress > 0.68 && progress < 0.74 ? 0.16 : 1;
  const isSpeaking = speechActivity === 'speaking' && isProgressInsideSpeechWindow(progress, speechWindows);
  const speechState = speechActivity === 'resting' ? 'resting' : isSpeaking ? 'speaking' : 'paused';
  const mouthSync = speechState === 'speaking' ? 'tts' : speechState === 'paused' ? 'pause' : 'idle';
  const speechLabel = speechState === 'speaking' ? '\u0054\u0054\u0053\u53e3\u64ad\u540c\u6b65' : speechState === 'paused' ? '\u53e3\u64ad\u505c\u987f' : '\u9759\u97f3\u966a\u4f34';
  const mouthOpen = isSpeaking && progress > 0.08 && progress < 0.92 && Math.sin(phase * 7) > -0.2;
  const leftArmMotion = Math.sin(phase) * 7;
  const rightArmMotion = Math.cos(phase) * 7;
  const isWarning = presenterState === 'warning_alert';
  const isPointing = presenterState === 'point_explain';
  const isWelcoming = presenterState === 'welcome_wave';
  const isCheering = presenterState === 'summary_cheer';
  const leftArmRotation = isPointing ? -18 - Math.abs(leftArmMotion) : isWelcoming ? -28 - Math.abs(leftArmMotion) : leftArmMotion * 0.35;
  const rightArmRotation = isWarning ? -22 - Math.abs(rightArmMotion) : isCheering ? -18 - Math.abs(rightArmMotion) : rightArmMotion * 0.35;

  return (
    <aside
      aria-label={`${copy.label} ${copy.badge} ${cueLabel} ${targetLabel} \u773c\u955c \u7728\u773c ${speechLabel}`}
      data-mouth-sync={mouthSync}
      data-presenter-motion="active"
      data-presenter-progress={progress.toFixed(2)}
      data-presenter-speech={speechState}
      data-presenter-state={presenterState}
      data-teaching-cue={teachingCue}
      data-teaching-target={target}
      style={presenterWrapStyle}
    >
      <div style={speechBubbleStyle(isWarning)}>
        <span style={speechBadgeStyle}>{copy.badge}</span>
        <strong style={speechNameStyle}>{copy.label}</strong>
      </div>
      {teachingCue !== 'none' ? (
        <div style={cueCalloutStyle(teachingCue)}>
          <span style={cueDotStyle(teachingCue)} />
          <strong>{cueLabel}</strong>
        </div>
      ) : null}
      {target !== 'none' ? (
        <div aria-hidden="true" data-target-pointer={target} style={targetPointerStyle(target)}>
          <span style={targetLineStyle(target)} />
          <span style={targetArrowHeadStyle(target)} />
        </div>
      ) : null}
      <svg
        aria-hidden="true"
        height="238"
        role="img"
        style={mascotSvgStyle(copy.rotation, floatY)}
        viewBox="0 0 220 238"
        width="220"
      >
        <ellipse cx="112" cy="222" fill="rgba(16, 42, 67, 0.18)" rx="70" ry="12" />
        <path
          d="M67 198c-20-16-26-43-14-66 11-22 34-34 59-34s48 12 59 34c12 23 6 50-14 66-16 13-30 18-45 18s-29-5-45-18z"
          fill="#C95F36"
        />
        <path
          d="M77 198c10 9 22 13 35 13s25-4 35-13c-4-28-15-45-35-45s-31 17-35 45z"
          fill="#FFF1D7"
        />
        <path
          d="M64 128c-21 10-37 28-45 51"
          fill="none"
          stroke="#7B3F2A"
          strokeLinecap="round"
          strokeWidth="18"
          transform={`rotate(${leftArmRotation.toFixed(1)} 64 128)`}
        />
        <path
          d="M160 128c20 11 35 29 42 52"
          fill="none"
          stroke="#7B3F2A"
          strokeLinecap="round"
          strokeWidth="18"
          transform={`rotate(${rightArmRotation.toFixed(1)} 160 128)`}
        />
        <path d="M56 66c-8-26 8-48 34-38 4 19-6 32-23 45z" fill="#7B3F2A" />
        <path d="M164 66c8-26-8-48-34-38-4 19 6 32 23 45z" fill="#7B3F2A" />
        <path d="M50 100c0-42 27-72 62-72s62 30 62 72-27 73-62 73-62-31-62-73z" fill="#D86C3E" />
        <path d="M73 82c9-21 25-33 39-33s30 12 39 33c-9 11-23 18-39 18S82 93 73 82z" fill="#FFF1D7" />
        <path d="M62 107c9-23 25-32 42-24-2 22-16 37-38 42z" fill="#7B3F2A" opacity="0.92" />
        <path d="M158 107c-9-23-25-32-42-24 2 22 16 37 38 42z" fill="#7B3F2A" opacity="0.92" />
        <circle cx="91" cy="102" fill="#102A43" r="5" transform={`translate(91 102) scale(1 ${blinkScale}) translate(-91 -102)`} />
        <circle cx="129" cy="102" fill="#102A43" r="5" transform={`translate(129 102) scale(1 ${blinkScale}) translate(-129 -102)`} />
        <circle cx="91" cy="102" fill="none" r="17" stroke="#102A43" strokeWidth="4" />
        <circle cx="129" cy="102" fill="none" r="17" stroke="#102A43" strokeWidth="4" />
        <path d="M108 102h8" fill="none" stroke="#102A43" strokeLinecap="round" strokeWidth="4" />
        <path d="M86 81h-22" fill="none" stroke="#102A43" strokeLinecap="round" strokeWidth="5" />
        <path d="M134 81h22" fill="none" stroke="#102A43" strokeLinecap="round" strokeWidth="5" />
        <path
          d={mouthOpen ? 'M102 122c4 10 16 10 20 0' : 'M101 122c3 5 15 5 18 0'}
          fill="none"
          stroke="#102A43"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path d="M106 114l6 7 6-7z" fill="#102A43" />
        <path d="M75 147c11 12 61 12 72 0" fill="none" stroke="#FFF1D7" strokeLinecap="round" strokeWidth="6" />
        {isWarning ? <path d="M176 50l12 24h-24z" fill="#F5C542" stroke="#102A43" strokeWidth="4" /> : null}
        {isWelcoming ? <path d="M30 110c-10-11-13-24-7-36" fill="none" stroke="#F5C542" strokeLinecap="round" strokeWidth="6" /> : null}
        {isCheering ? <path d="M175 61l8 8 12-17" fill="none" stroke="#52B788" strokeLinecap="round" strokeWidth="7" /> : null}
      </svg>
      <span style={hiddenDescriptorStyle}>{`${cueLabel} ${targetLabel} \u773c\u955c \u7728\u773c ${speechLabel}`}</span>
    </aside>
  );
};

const presenterWrapStyle = {
  alignItems: 'center',
  bottom: 56,
  display: 'grid',
  justifyItems: 'center',
  pointerEvents: 'none' as const,
  position: 'absolute' as const,
  right: 46,
  width: 240,
  zIndex: 5
};

const speechBubbleStyle = (isWarning: boolean) => ({
  background: isWarning ? '#FFF1D7' : '#FFFFFF',
  border: `3px solid ${isWarning ? '#F5C542' : 'rgba(16, 42, 67, 0.14)'}`,
  borderRadius: 24,
  boxShadow: '0 18px 44px rgba(16, 42, 67, 0.18)',
  color: '#102A43',
  display: 'grid',
  gap: 3,
  marginBottom: -4,
  padding: '12px 16px',
  position: 'relative' as const,
  textAlign: 'center' as const
});

const speechBadgeStyle = {
  color: '#1F5134',
  fontSize: 18,
  fontWeight: 900,
  letterSpacing: 1
};

const speechNameStyle = {
  fontSize: 22,
  fontWeight: 900
};

const cueCalloutStyle = (teachingCue: PresenterTeachingCue) => ({
  alignItems: 'center',
  background: teachingCue === 'warning_flash' ? '#FFF1D7' : 'rgba(255, 255, 255, 0.92)',
  border: `2px solid ${teachingCue === 'warning_flash' ? '#F5C542' : 'rgba(31, 81, 52, 0.18)'}`,
  borderRadius: 999,
  boxShadow: '0 12px 28px rgba(16, 42, 67, 0.14)',
  color: teachingCue === 'warning_flash' ? '#9A3412' : '#1F5134',
  display: 'flex',
  fontSize: 17,
  fontWeight: 900,
  gap: 8,
  marginBottom: 6,
  padding: '8px 13px'
});

const cueDotStyle = (teachingCue: PresenterTeachingCue) => ({
  background:
    teachingCue === 'warning_flash'
      ? '#F97316'
      : teachingCue === 'summary_reward'
        ? '#52B788'
        : teachingCue === 'diagram_pointer'
          ? '#3B82F6'
          : '#F5C542',
  borderRadius: '50%',
  boxShadow: '0 0 0 6px rgba(245, 197, 66, 0.18)',
  height: 12,
  width: 12
});

const targetPointerTop: Record<PresenterTeachingTarget, number> = {
  comparison_card: 94,
  diagram_area: 118,
  formula_board: 132,
  none: 0,
  problem_keywords: 104,
  summary_answer: 150
};

const targetPointerColor = (target: PresenterTeachingTarget) => {
  if (target === 'comparison_card') return '#F97316';
  if (target === 'summary_answer') return '#52B788';
  if (target === 'diagram_area') return '#3B82F6';
  if (target === 'problem_keywords') return '#1F5134';

  return '#F5C542';
};

const targetPointerStyle = (target: PresenterTeachingTarget) => ({
  alignItems: 'center',
  display: 'flex',
  left: -216,
  position: 'absolute' as const,
  top: targetPointerTop[target],
  width: 216
});

const targetLineStyle = (target: PresenterTeachingTarget) => ({
  background: `linear-gradient(90deg, rgba(255,255,255,0), ${targetPointerColor(target)})`,
  borderRadius: 999,
  boxShadow: `0 0 18px ${targetPointerColor(target)}55`,
  height: 5,
  width: 188
});

const targetArrowHeadStyle = (target: PresenterTeachingTarget) => ({
  borderBottom: '9px solid transparent',
  borderLeft: `15px solid ${targetPointerColor(target)}`,
  borderTop: '9px solid transparent',
  height: 0,
  width: 0
});

const mascotSvgStyle = (rotation: number, floatY: number) => ({
  filter: 'drop-shadow(0 20px 28px rgba(16, 42, 67, 0.22))',
  transform: `translateY(${floatY.toFixed(1)}px) rotate(${rotation}deg)`,
  transformOrigin: '50% 85%'
});

const hiddenDescriptorStyle = {
  color: 'transparent',
  fontSize: 1,
  height: 1,
  overflow: 'hidden',
  position: 'absolute' as const,
  width: 1
};
