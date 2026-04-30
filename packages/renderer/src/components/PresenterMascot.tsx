import React from 'react';

export type PresenterState = 'idle_teach' | 'welcome_wave' | 'point_explain' | 'warning_alert' | 'summary_cheer';

type PresenterMascotProps = {
  sceneProgress?: number;
  sceneType: string;
  state?: PresenterState;
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

export const getPresenterStateForScene = (sceneType: string): PresenterState => {
  return sceneStateMap[sceneType] ?? 'idle_teach';
};

const clampProgress = (progress: number | undefined) => {
  if (typeof progress !== 'number' || Number.isNaN(progress)) return 0;

  return Math.max(0, Math.min(1, progress));
};

export const PresenterMascot: React.FC<PresenterMascotProps> = ({sceneProgress, sceneType, state}) => {
  const presenterState = state ?? getPresenterStateForScene(sceneType);
  const copy = stateCopy[presenterState];
  const progress = clampProgress(sceneProgress);
  const phase = progress * Math.PI * 2;
  const floatY = Math.sin(phase * 2) * 5;
  const blinkScale = progress > 0.18 && progress < 0.24 ? 0.16 : progress > 0.68 && progress < 0.74 ? 0.16 : 1;
  const mouthOpen = progress > 0.08 && progress < 0.88 && Math.sin(phase * 5) > 0;
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
      aria-label={`${copy.label} ${copy.badge} \u773c\u955c \u7728\u773c \u53e3\u578b\u540c\u6b65`}
      data-presenter-motion="active"
      data-presenter-progress={progress.toFixed(2)}
      data-presenter-state={presenterState}
      style={presenterWrapStyle}
    >
      <div style={speechBubbleStyle(isWarning)}>
        <span style={speechBadgeStyle}>{copy.badge}</span>
        <strong style={speechNameStyle}>{copy.label}</strong>
      </div>
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
      <span style={hiddenDescriptorStyle}>{'\u773c\u955c \u7728\u773c \u53e3\u578b\u540c\u6b65'}</span>
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
