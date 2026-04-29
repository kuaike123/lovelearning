'use client';

import React, {useState} from 'react';

import {FeaturedSampleShowcase} from './FeaturedSampleShowcase';
import {RecentJobsPanel} from './RecentJobsPanel';
import {SubmitJobForm} from './SubmitJobForm';
import {SupportedScope} from './SupportedScope';
import {createButtonStyle, createCardStyle, createPillStyle, uiColors} from './ui-primitives';

type ViewId = 'create' | 'samples' | 'jobs';

type HomeWorkspaceSwitcherProps = {
  initialContent: string;
  initialSpeechRate?: 'slow' | 'normal' | 'fast';
  initialStyle?: 'teacher' | 'kids' | 'exam';
  initialTargetDurationSec?: 30 | 45 | 60;
  initialTaskName?: string;
  initialView?: ViewId;
  initialVoice?: 'female_warm' | 'female_clear' | 'male_calm';
};

type ViewCard = {
  accent: string;
  body: string;
  eyebrow: string;
  helper: string;
  id: ViewId;
  panelBody: string;
  panelTitle: string;
  title: string;
};

const viewCards: ViewCard[] = [
  {
    accent: '#102A43',
    body: '输入题目、试听音色，并开始生成讲解视频。',
    eyebrow: '创作模式',
    helper: '默认推荐从这里开始，把一道题快速变成可演示的讲解视频任务。',
    id: 'create',
    panelBody: '聚焦题目输入、配音策略和生成操作，适合直接开始做一条新视频。',
    panelTitle: '新建一条教培讲解视频',
    title: '新建视频'
  },
  {
    accent: '#1F5134',
    body: '按题型和用途挑选样片，一键套用配置。',
    eyebrow: '样片模式',
    helper: '先看哪种成片风格最适合，再套用样片配置，适合招生、演示和运营素材制作。',
    id: 'samples',
    panelBody: '把样片库独立成一个浏览工作区，方便先选风格，再决定要不要套用。',
    panelTitle: '从样片库里挑一个合适的起点',
    title: '浏览样片'
  },
  {
    accent: '#7C4A03',
    body: '跟踪生成状态，查看结果并管理任务。',
    eyebrow: '运营模式',
    helper: '这里更像运营面板，集中看最近在生成什么，也看当前 V1 能力边界。',
    id: 'jobs',
    panelBody: '用于跟进任务进度、回看交付结果，并随时从示例题重新开始。',
    panelTitle: '集中查看进度与可用能力',
    title: '查看进度'
  }
];

export function HomeWorkspaceSwitcher({
  initialContent,
  initialSpeechRate,
  initialStyle,
  initialTargetDurationSec,
  initialTaskName,
  initialView = 'create',
  initialVoice
}: HomeWorkspaceSwitcherProps) {
  const [activeView, setActiveView] = useState<ViewId>(initialView);
  const activeCard = viewCards.find((entry) => entry.id === activeView) ?? viewCards[0];

  return (
    <section style={workspaceSectionStyle}>
      <style>{homeMotionStyles}</style>

      <div style={entryGridStyle}>
        {viewCards.map((entry) => {
          const selected = entry.id === activeView;

          return (
            <button
              key={entry.id}
              type="button"
              data-home-entry={entry.id}
              onClick={() => setActiveView(entry.id)}
              style={{
                ...entryCardStyle,
                ...(selected ? createActiveEntryCardStyle(entry.accent) : {})
              }}
            >
              <div style={entryTopRowStyle}>
                <span style={createIconBadgeStyle(entry.accent, selected)}>
                  <ModeGlyph accent={entry.accent} mode={entry.id} />
                </span>
                <span
                  style={
                    selected
                      ? {...createPillStyle({tone: 'accent'}), width: 'fit-content'}
                      : {...entryHintStyle, color: entry.accent}
                  }
                >
                  {selected ? '当前工作区' : '点击进入'}
                </span>
              </div>
              <span style={{...entryEyebrowStyle, color: entry.accent}}>{entry.eyebrow}</span>
              <p style={entryTitleStyle}>{entry.title}</p>
              <p style={entryBodyStyle}>{entry.body}</p>
            </button>
          );
        })}
      </div>

      <div style={panelStyle}>
        <section
          data-home-motion="panel-hero"
          style={{
            ...panelHeroStyle,
            background: buildPanelGradient(activeCard.accent)
          }}
        >
          <div style={panelHeroContentStyle}>
            <span style={panelHeroEyebrowStyle}>{activeCard.eyebrow}</span>
            <h3 style={panelHeroTitleStyle}>{activeCard.panelTitle}</h3>
            <p style={panelHeroBodyStyle}>{activeCard.panelBody}</p>
            <div style={panelHeroActionRowStyle}>
              {viewCards.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setActiveView(entry.id)}
                  style={entry.id === activeView ? activeActionStyle : inactiveActionStyle}
                >
                  {entry.title}
                </button>
              ))}
            </div>
          </div>

          <div style={panelHeroAsideStyle}>
            <div style={panelHeroMetaRowStyle}>
              <span style={{...createPillStyle({tone: 'accent'}), width: 'fit-content'}}>
                {activeCard.title}
              </span>
              <span style={panelHeroHelperBadgeStyle}>教培视频工作流</span>
            </div>
            <p style={panelHeroHelperStyle}>{activeCard.helper}</p>
            <div data-home-illustration={activeCard.id} style={panelIllustrationFrameStyle}>
              <ModeIllustration accent={activeCard.accent} mode={activeCard.id} />
            </div>
          </div>
        </section>

        {activeView === 'create' ? (
          <section data-home-panel="create" style={panelContentStyle}>
            <div style={createCardStyle({tone: 'elevated'})}>
              <SubmitJobForm
                initialContent={initialContent}
                initialStyle={initialStyle}
                initialTargetDurationSec={initialTargetDurationSec}
                initialTaskName={initialTaskName}
                initialVoice={initialVoice}
                initialSpeechRate={initialSpeechRate}
              />
            </div>
          </section>
        ) : null}

        {activeView === 'samples' ? (
          <section data-home-panel="samples" style={panelContentStyle}>
            <FeaturedSampleShowcase />
          </section>
        ) : null}

        {activeView === 'jobs' ? (
          <section data-home-panel="jobs" style={panelContentStyle}>
            <RecentJobsPanel />
            <SupportedScope />
          </section>
        ) : null}
      </div>
    </section>
  );
}

function ModeGlyph({accent, mode}: {accent: string; mode: ViewId}) {
  if (mode === 'create') {
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48" style={glyphSvgStyle}>
        <rect fill="rgba(255,255,255,0.16)" height="32" rx="10" width="32" x="8" y="8" />
        <path d="M21 17L31 24L21 31V17Z" fill="#FFF4CC" />
        <path d="M15 35H33" stroke={accent} strokeLinecap="round" strokeWidth="3" />
      </svg>
    );
  }

  if (mode === 'samples') {
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48" style={glyphSvgStyle}>
        <rect fill="rgba(255,255,255,0.14)" height="24" rx="7" width="18" x="10" y="14" />
        <rect fill="#FFF4CC" height="24" rx="7" width="18" x="20" y="10" />
        <circle cx="29" cy="18" fill={accent} r="3" />
        <path d="M24 30L28 25L32 28L36 22L38 30H24Z" fill={accent} opacity="0.76" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" style={glyphSvgStyle}>
      <path d="M14 34V24" stroke="#FFF4CC" strokeLinecap="round" strokeWidth="4" />
      <path d="M24 34V16" stroke="#FFF4CC" strokeLinecap="round" strokeWidth="4" />
      <path d="M34 34V20" stroke="#FFF4CC" strokeLinecap="round" strokeWidth="4" />
      <path d="M12 38H36" stroke={accent} strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

function ModeIllustration({accent, mode}: {accent: string; mode: ViewId}) {
  if (mode === 'create') {
    return (
      <div style={illustrationCanvasStyle}>
        <div style={{...floatingOrbStyle, background: 'rgba(255, 244, 204, 0.16)', inset: '12px auto auto 18px'}} />
        <div style={{...floatingOrbStyle, background: 'rgba(255, 255, 255, 0.12)', inset: 'auto 20px 18px auto'}} />
        <div style={{...illustrationCardStyle, animation: 'heroFloat 6s ease-in-out infinite'}}>
          <div style={illustrationCardTopStyle}>
            <span style={miniPillStyle}>题目脚本</span>
            <span style={dotClusterStyle}>
              <span style={dotStyle('#FFB703')} />
              <span style={dotStyle('#8ECAE6')} />
              <span style={dotStyle('#90BE6D')} />
            </span>
          </div>
          <div style={equationBlockStyle}>
            <span style={formulaChipStyle}>2x + 3 = 11</span>
            <span style={transformationArrowStyle}>→</span>
            <span style={formulaChipStyle}>x = 4</span>
          </div>
          <div style={waveRowStyle}>
            <span style={waveBarStyle(18, accent)} />
            <span style={waveBarStyle(32, '#FFF4CC')} />
            <span style={waveBarStyle(24, '#90BE6D')} />
            <span style={waveBarStyle(36, '#8ECAE6')} />
            <span style={waveBarStyle(20, '#FFF4CC')} />
          </div>
        </div>
        <div style={{...floatingTagStyle, top: 28, right: 26}}>TTS 配音</div>
        <div style={{...floatingTagStyle, bottom: 26, left: 28}}>步骤动画</div>
      </div>
    );
  }

  if (mode === 'samples') {
    return (
      <div style={illustrationCanvasStyle}>
        <div style={{...posterStackStyle, transform: 'rotate(-8deg) translateY(8px)'}}>
          <div style={posterHeaderStyle('#E7F0DA')} />
          <div style={posterBodyStyle}>
            <div style={posterLineStyle('64%')} />
            <div style={posterLineStyle('78%')} />
            <div style={posterLineStyle('55%')} />
          </div>
        </div>
        <div
          style={{
            ...posterStackStyle,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,250,241,0.94))',
            transform: 'rotate(3deg)',
            zIndex: 2,
            animation: 'posterLift 5.8s ease-in-out infinite'
          }}
        >
          <div style={posterHeaderStyle('#FFF4CC')} />
          <div style={posterPreviewStyle}>
            <div style={posterCoverStyle(accent)} />
            <div style={posterMetaStyle}>
              <div style={posterLineStyle('72%')} />
              <div style={posterLineStyle('58%')} />
              <div style={posterLineStyle('82%')} />
            </div>
          </div>
        </div>
        <div style={{...floatingTagStyle, top: 24, left: 18}}>封面预览</div>
        <div style={{...floatingTagStyle, bottom: 24, right: 24}}>一键套用</div>
      </div>
    );
  }

  return (
    <div style={illustrationCanvasStyle}>
      <div style={{...timelineCardStyle, animation: 'heroFloat 5.6s ease-in-out infinite'}}>
        <div style={timelineRowStyle}>
          <span style={statusDotStyle('#90BE6D')} />
          <div style={timelineTextStyle}>
            <strong style={timelineTitleStyle}>脚本生成完成</strong>
            <span style={timelineMetaStyle}>已进入音频合成</span>
          </div>
        </div>
        <div style={progressTrackStyle}>
          <span style={progressFillStyle('66%', accent)} />
        </div>
        <div style={timelineRowStyle}>
          <span style={statusDotStyle('#F5C542')} />
          <div style={timelineTextStyle}>
            <strong style={timelineTitleStyle}>视频渲染中</strong>
            <span style={timelineMetaStyle}>预计 1 分钟内完成</span>
          </div>
        </div>
        <div style={progressTrackStyle}>
          <span style={progressFillStyle('42%', '#FFF4CC')} />
        </div>
      </div>
      <div style={{...floatingTagStyle, top: 24, left: 20}}>任务状态</div>
      <div style={{...floatingTagStyle, bottom: 22, right: 24}}>失败可重试</div>
    </div>
  );
}

const workspaceSectionStyle = {
  display: 'grid',
  gap: 18
};

const entryGridStyle = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
};

const entryCardStyle = {
  ...createCardStyle({tone: 'default'}),
  background: 'linear-gradient(180deg, #fffdf8 0%, #fff9ef 100%)',
  border: `1px solid ${uiColors.border}`,
  cursor: 'pointer',
  gap: 10,
  textAlign: 'left' as const,
  transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease'
};

const entryTopRowStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: 12,
  justifyContent: 'space-between'
};

const createActiveEntryCardStyle = (accent: string) => ({
  border: `1px solid ${accent}`,
  boxShadow: '0 14px 32px rgba(16, 42, 67, 0.14)',
  transform: 'translateY(-3px)'
});

const createIconBadgeStyle = (accent: string, selected: boolean) => ({
  alignItems: 'center',
  background: selected ? `linear-gradient(135deg, ${accent} 0%, rgba(255, 244, 204, 0.78) 100%)` : '#fff4cc',
  border: `1px solid ${selected ? accent : 'rgba(124, 74, 3, 0.14)'}`,
  borderRadius: 18,
  boxShadow: selected ? '0 10px 18px rgba(16, 42, 67, 0.16)' : 'none',
  display: 'inline-flex',
  height: 54,
  justifyContent: 'center',
  width: 54
});

const glyphSvgStyle = {
  display: 'block',
  height: 30,
  width: 30
};

const entryEyebrowStyle = {
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.2
};

const entryTitleStyle = {
  color: '#102A43',
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 24,
  lineHeight: 1.2,
  margin: 0
};

const entryBodyStyle = {
  color: '#4b5563',
  lineHeight: 1.65,
  margin: 0
};

const entryHintStyle = {
  fontSize: 12,
  fontWeight: 700
};

const panelStyle = {
  display: 'grid',
  gap: 18
};

const panelContentStyle = {
  display: 'grid',
  gap: 16
};

const panelHeroStyle = {
  borderRadius: 28,
  color: '#fffdf8',
  display: 'grid',
  gap: 22,
  gridTemplateColumns: 'minmax(0, 1.2fr) minmax(300px, 0.9fr)',
  overflow: 'hidden',
  padding: '24px 24px 26px',
  position: 'relative' as const
};

const panelHeroContentStyle = {
  display: 'grid',
  gap: 12
};

const panelHeroEyebrowStyle = {
  color: '#fff4cc',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.3
};

const panelHeroTitleStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 32,
  lineHeight: 1.12,
  margin: 0
};

const panelHeroBodyStyle = {
  color: 'rgba(255,253,248,0.92)',
  lineHeight: 1.7,
  margin: 0,
  maxWidth: 640
};

const panelHeroAsideStyle = {
  alignContent: 'start',
  display: 'grid',
  gap: 14,
  justifyItems: 'start'
};

const panelHeroMetaRowStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 10
};

const panelHeroHelperBadgeStyle = {
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 999,
  color: '#fff8dc',
  display: 'inline-flex',
  fontSize: 12,
  fontWeight: 700,
  padding: '6px 10px'
};

const panelHeroHelperStyle = {
  color: 'rgba(255,253,248,0.86)',
  lineHeight: 1.65,
  margin: 0
};

const panelHeroActionRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 10,
  marginTop: 4
};

const panelIllustrationFrameStyle = {
  alignSelf: 'stretch',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 24,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
  minHeight: 214,
  overflow: 'hidden',
  padding: 16,
  width: '100%'
};

const illustrationCanvasStyle = {
  background:
    'radial-gradient(circle at top left, rgba(255,244,204,0.22), transparent 38%), linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))',
  borderRadius: 20,
  height: '100%',
  minHeight: 180,
  overflow: 'hidden',
  position: 'relative' as const
};

const floatingOrbStyle = {
  borderRadius: 999,
  filter: 'blur(4px)',
  height: 68,
  position: 'absolute' as const,
  width: 68
};

const illustrationCardStyle = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,249,239,0.92))',
  border: '1px solid rgba(16, 42, 67, 0.08)',
  borderRadius: 20,
  boxShadow: '0 18px 32px rgba(16, 42, 67, 0.18)',
  display: 'grid',
  gap: 16,
  inset: '30px 22px 22px',
  padding: 18,
  position: 'absolute' as const
};

const illustrationCardTopStyle = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between'
};

const miniPillStyle = {
  background: '#FFF4CC',
  borderRadius: 999,
  color: '#7C4A03',
  display: 'inline-flex',
  fontSize: 12,
  fontWeight: 800,
  padding: '6px 10px'
};

const dotClusterStyle = {
  alignItems: 'center',
  display: 'inline-flex',
  gap: 6
};

const dotStyle = (background: string) => ({
  background,
  borderRadius: 999,
  display: 'inline-flex',
  height: 8,
  width: 8
});

const equationBlockStyle = {
  alignItems: 'center',
  display: 'grid',
  gap: 12,
  gridTemplateColumns: '1fr auto 1fr'
};

const formulaChipStyle = {
  background: '#F8F3E7',
  border: '1px solid #EADFCB',
  borderRadius: 16,
  color: '#102A43',
  display: 'inline-flex',
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 20,
  fontWeight: 700,
  justifyContent: 'center',
  padding: '18px 14px'
};

const transformationArrowStyle = {
  color: '#7C4A03',
  fontSize: 22,
  fontWeight: 800
};

const waveRowStyle = {
  alignItems: 'end',
  display: 'flex',
  gap: 8,
  height: 40
};

const waveBarStyle = (height: number, background: string) => ({
  animation: 'wavePulse 2.4s ease-in-out infinite',
  background,
  borderRadius: 999,
  display: 'inline-flex',
  height,
  width: 10
});

const floatingTagStyle = {
  animation: 'tagDrift 5s ease-in-out infinite',
  background: 'rgba(255,255,255,0.14)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 999,
  color: '#FFF8DC',
  fontSize: 12,
  fontWeight: 700,
  padding: '7px 12px',
  position: 'absolute' as const
};

const posterStackStyle = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,250,241,0.88))',
  border: '1px solid rgba(16, 42, 67, 0.08)',
  borderRadius: 18,
  boxShadow: '0 16px 28px rgba(16, 42, 67, 0.16)',
  display: 'grid',
  gap: 12,
  inset: '30px 30px 30px 34px',
  padding: 14,
  position: 'absolute' as const
};

const posterHeaderStyle = (background: string) => ({
  background,
  borderRadius: 12,
  height: 46
});

const posterBodyStyle = {
  display: 'grid',
  gap: 10
};

const posterLineStyle = (width: string) => ({
  background: '#EADFCB',
  borderRadius: 999,
  height: 8,
  width
});

const posterPreviewStyle = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: '86px 1fr'
};

const posterCoverStyle = (accent: string) => ({
  background: `linear-gradient(160deg, ${accent} 0%, #FFF4CC 100%)`,
  borderRadius: 16,
  height: 104
});

const posterMetaStyle = {
  alignContent: 'start',
  display: 'grid',
  gap: 10
};

const timelineCardStyle = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,249,239,0.9))',
  border: '1px solid rgba(16, 42, 67, 0.08)',
  borderRadius: 20,
  boxShadow: '0 18px 30px rgba(16, 42, 67, 0.16)',
  display: 'grid',
  gap: 14,
  inset: '32px 24px 24px',
  padding: 18,
  position: 'absolute' as const
};

const timelineRowStyle = {
  alignItems: 'center',
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'auto 1fr'
};

const statusDotStyle = (background: string) => ({
  background,
  borderRadius: 999,
  boxShadow: `0 0 0 6px ${background}22`,
  display: 'inline-flex',
  height: 12,
  width: 12
});

const timelineTextStyle = {
  display: 'grid',
  gap: 4
};

const timelineTitleStyle = {
  color: '#102A43',
  fontSize: 15,
  lineHeight: 1.4
};

const timelineMetaStyle = {
  color: '#6B7280',
  fontSize: 13,
  lineHeight: 1.5
};

const progressTrackStyle = {
  background: '#ECE5D5',
  borderRadius: 999,
  display: 'flex',
  height: 9,
  overflow: 'hidden'
};

const progressFillStyle = (width: string, background: string) => ({
  animation: 'progressSweep 4s ease-in-out infinite',
  background,
  borderRadius: 999,
  display: 'inline-flex',
  width
});

const activeActionStyle = {
  ...createButtonStyle({tone: 'quiet'}),
  background: '#FFF4CC',
  border: '1px solid #FFF4CC',
  color: '#7C4A03'
};

const inactiveActionStyle = {
  ...createButtonStyle({tone: 'secondary'}),
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.22)',
  color: '#fffdf8'
};

const buildPanelGradient = (accent: string) => {
  return `linear-gradient(135deg, ${accent} 0%, #1B4332 58%, #6F7D45 100%)`;
};

const homeMotionStyles = `
  @keyframes heroFloat {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes posterLift {
    0%, 100% {
      transform: rotate(3deg) translateY(0px);
    }
    50% {
      transform: rotate(3deg) translateY(-6px);
    }
  }

  @keyframes wavePulse {
    0%, 100% {
      transform: scaleY(0.82);
      opacity: 0.72;
    }
    50% {
      transform: scaleY(1.08);
      opacity: 1;
    }
  }

  @keyframes tagDrift {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-4px);
    }
  }

  @keyframes progressSweep {
    0%, 100% {
      filter: saturate(0.95);
      transform: scaleX(0.98);
      transform-origin: left center;
    }
    50% {
      filter: saturate(1.08);
      transform: scaleX(1);
      transform-origin: left center;
    }
  }
`;
