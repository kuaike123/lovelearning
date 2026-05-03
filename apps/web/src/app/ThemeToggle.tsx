'use client';

import React from 'react';

import {useTheme} from './ThemeProvider';
import {createButtonStyle, designTokens} from './ui-primitives-v2';

export function ThemeToggle() {
  const {mode, setMode} = useTheme();
  const nextMode = mode === 'professional' ? 'creative' : 'professional';

  return (
    <button
      type="button"
      data-theme-toggle="mode-switch"
      aria-label="切换界面主题"
      onClick={() => setMode(nextMode)}
      style={themeToggleStyle}
    >
      <span style={themeToggleDotStyle} aria-hidden="true" />
      {mode === 'professional' ? '专业模式' : '创意模式'}
    </button>
  );
}

const themeToggleStyle = {
  ...createButtonStyle('outline', 'sm'),
  background: 'rgba(255,255,255,0.72)',
  borderColor: designTokens.colors.neutral[300],
  color: designTokens.colors.neutral[800],
  gap: designTokens.spacing[2],
  justifySelf: 'end'
};

const themeToggleDotStyle = {
  background: designTokens.colors.brand.primary,
  borderRadius: designTokens.borderRadius.full,
  display: 'inline-flex',
  height: 8,
  width: 8
};
