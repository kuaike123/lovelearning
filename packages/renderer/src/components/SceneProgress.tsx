import React from 'react';

type SceneProgressProps = {
  progress: number;
};

export const SceneProgress: React.FC<SceneProgressProps> = ({progress}) => {
  const percent = Math.round(clamp(progress) * 100);
  const rhythmLabel = getRhythmLabel(progress);

  return (
    <div aria-label={'\u89c6\u9891\u8bb2\u89e3\u8fdb\u5ea6'} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <div style={trackStyle}>
        <div style={{...fillStyle, width: `${percent}%`}} />
      </div>
      <span style={rhythmStyle}>{rhythmLabel}</span>
      <span style={labelStyle}>{percent}%</span>
    </div>
  );
};

const clamp = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
};

const getRhythmLabel = (progress: number) => {
  const safeProgress = clamp(progress);

  if (safeProgress < 0.2) {
    return '展示原式';
  }

  if (safeProgress < 0.8) {
    return '推进变形';
  }

  return '停留总结';
};

const trackStyle = {
  background: 'rgba(16, 42, 67, 0.16)',
  borderRadius: 999,
  height: 16,
  overflow: 'hidden',
  width: '100%'
};

const fillStyle = {
  background: 'linear-gradient(90deg, #F5C542, #52B788)',
  borderRadius: 999,
  height: '100%',
  transition: 'width 180ms ease'
};

const labelStyle = {
  color: '#597047',
  display: 'block',
  fontSize: 20,
  fontWeight: 800,
  marginTop: 6,
  textAlign: 'right' as const
};

const rhythmStyle = {
  color: '#102A43',
  display: 'block',
  fontSize: 18,
  fontWeight: 800,
  marginTop: 10
};
