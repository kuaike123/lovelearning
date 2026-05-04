'use client';

import React, {useState} from 'react';

import {FeaturedSampleShowcase} from './FeaturedSampleShowcase';
import {RecentJobsPanel} from './RecentJobsPanel';
import {SubmitJobForm} from './SubmitJobForm';
import {SupportedScope} from './SupportedScope';
import {createButtonStyle, createCardStyle, createPillStyle, uiColors} from './ui-primitives';
import {
  createCardStyle as createProfessionalCardStyle,
  designTokens,
  keyframes as professionalKeyframes
} from './ui-primitives-v2';

type ViewId = 'dashboard' | 'create' | 'samples' | 'jobs' | 'materials' | 'roadmap';

type HomeWorkspaceSwitcherProps = {
  dashboardSlot?: React.ReactNode;
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
  navLabel?: string;
  panelBody: string;
  panelTitle: string;
  title: string;
};

const viewCards: ViewCard[] = [
  {
    accent: '#D9482E',
    body: '\u603b\u89c8\u4eca\u65e5\u4ea7\u51fa\u3001\u9898\u578b\u80fd\u529b\u548c\u4e0b\u4e00\u6b65\u4f18\u5316\u91cd\u70b9\u3002',
    eyebrow: '\u4ea7\u54c1\u603b\u89c8',
    helper: '\u56fa\u5b9a\u9879\u76ee\u680f\u8ba9\u8001\u5e08\u50cf\u4f7f\u7528\u4e3b\u6d41 SaaS \u4e00\u6837\u5207\u6362\u5de5\u4f5c\u533a\uff0c\u53f3\u4fa7\u518d\u5c55\u793a\u5bf9\u5e94\u9875\u9762\u3002',
    id: 'dashboard',
    navLabel: '\u5de5\u4f5c\u53f0',
    panelBody: '\u628a\u751f\u6210\u6570\u636e\u3001\u9898\u578b\u8fb9\u754c\u548c\u8fd1\u671f\u4efb\u52a1\u653e\u5230\u9996\u5c4f\uff0c\u5148\u770b\u72b6\u6001\uff0c\u518d\u8fdb\u5165\u521b\u4f5c\u3002',
    panelTitle: '\u6559\u57f9\u89c6\u9891\u751f\u4ea7\u5de5\u4f5c\u53f0',
    title: '\u5de5\u4f5c\u53f0\u603b\u89c8'
  },
  {
    accent: '#102A43',
    body: '输入题目、试听音色，并开始生成讲解视频。',
    eyebrow: '创作模式',
    helper: '默认推荐从这里开始，把一道题快速变成可演示的讲解视频任务。',
    id: 'create',
    navLabel: '\u65b0\u5efa\u89c6\u9891',
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
    navLabel: '\u6837\u7247\u5e93',
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
    navLabel: '\u751f\u6210\u4efb\u52a1',
    panelBody: '用于跟进任务进度、回看交付结果，并随时从示例题重新开始。',
    panelTitle: '集中查看进度与可用能力',
    title: '查看进度'
  },
  {
    accent: '#39708F',
    body: '\u6c89\u6dc0\u9898\u5e93\u3001\u8bfe\u4ef6\u3001\u8bb2\u4e49\u548c\u5c01\u9762\u7d20\u6750\u3002',
    eyebrow: '\u7d20\u6750\u7ba1\u7406',
    helper: '\u8fd9\u4e2a\u5165\u53e3\u5148\u4f5c\u4e3a\u89c4\u5212\u5360\u4f4d\uff0c\u540e\u7eed\u53ef\u63a5 OCR\u3001\u9898\u5e93\u3001\u8bfe\u4ef6\u5bfc\u5165\u548c\u5c01\u9762\u8d44\u4ea7\u3002',
    id: 'materials',
    navLabel: '\u8bfe\u7a0b\u7d20\u6750',
    panelBody: '\u628a\u9898\u76ee\u3001\u77e5\u8bc6\u70b9\u3001\u5c01\u9762\u548c\u914d\u56fe\u8fdb\u884c\u7edf\u4e00\u7ba1\u7406\uff0c\u4e3a\u5168\u5b66\u79d1\u6269\u5c55\u505a\u51c6\u5907\u3002',
    panelTitle: '\u8bfe\u7a0b\u7d20\u6750\u4e2d\u5fc3',
    title: '\u8bfe\u7a0b\u7d20\u6750'
  },
  {
    accent: '#5D4B8C',
    body: '\u89c4\u5212\u6570\u5b66\u3001\u82f1\u8bed\u3001\u7269\u7406\u7b49\u5b66\u79d1\u7684\u9898\u578b\u6269\u5c55\u8def\u7ebf\u3002',
    eyebrow: '\u5168\u5b66\u79d1\u8def\u7ebf',
    helper: '\u4e0d\u628a\u4ee3\u7801\u5199\u6b7b\u5728\u6570\u5b66\u91cc\uff0c\u800c\u662f\u7528\u5b66\u79d1\u3001\u9898\u578b\u548c\u573a\u666f\u6a21\u677f\u7ee7\u7eed\u6a2a\u5411\u6269\u5c55\u3002',
    id: 'roadmap',
    navLabel: '\u5b66\u79d1\u89c4\u5212',
    panelBody: '\u8fd9\u91cc\u653e\u540e\u7eed\u5b66\u79d1\u80fd\u529b\u3001\u9898\u578b\u6a21\u677f\u548c\u52a8\u753b\u89d2\u8272\u8def\u7ebf\uff0c\u4fbf\u4e8e\u6309\u9636\u6bb5\u63a8\u8fdb\u3002',
    panelTitle: '\u5168\u5b66\u79d1\u80fd\u529b\u89c4\u5212',
    title: '\u5b66\u79d1\u89c4\u5212'
  }
];

export function HomeWorkspaceSwitcher({
  dashboardSlot,
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
    <section
      data-saas-shell="home-workspace"
      data-responsive-shell="desktop-sidebar"
      data-design-mode="professional"
      data-ui-system="v2"
      style={workspaceShellStyle}
    >
      <style>{homeMotionStyles}</style>

      <aside data-saas-sidebar="project-nav" style={projectSidebarStyle}>
        <div style={sidebarBrandBlockStyle}>
          <span style={sidebarBrandEyebrowStyle}>LoveLearning</span>
          <strong style={sidebarBrandTitleStyle}>全科 AI</strong>
        </div>

        <div style={projectNavListStyle}>
          {viewCards.map((entry) => {
            const selected = entry.id === activeView;

            return (
              <button
                key={entry.id}
                type="button"
                data-home-entry={entry.id}
                data-saas-nav={entry.id}
                onClick={() => setActiveView(entry.id)}
                style={{
                  ...projectNavButtonStyle,
                  ...(selected ? createActiveProjectNavButtonStyle(entry.accent) : {})
                }}
              >
                <span style={{...entryTitleStyle, color: selected ? entry.accent : '#102A43'}}>
                  {entry.navLabel ?? entry.title}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      <main data-saas-main="workspace-page" data-saas-page={activeView} style={panelStyle}>
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
            </div>
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

        {activeView === 'dashboard' ? (
          <section data-home-panel="dashboard" style={panelContentStyle}>
            {dashboardSlot ?? <PlaceholderWorkspace accent={activeCard.accent} mode="dashboard" />}
          </section>
        ) : null}

        {activeView === 'materials' ? (
          <section data-home-panel="materials" style={panelContentStyle}>
            <PlaceholderWorkspace accent={activeCard.accent} mode="materials" />
          </section>
        ) : null}

        {activeView === 'roadmap' ? (
          <section data-home-panel="roadmap" style={panelContentStyle}>
            <PlaceholderWorkspace accent={activeCard.accent} mode="roadmap" />
          </section>
        ) : null}
      </main>
    </section>
  );
}

function PlaceholderWorkspace({accent, mode}: {accent: string; mode: Extract<ViewId, 'dashboard' | 'materials' | 'roadmap'>}) {
  const copy = {
    dashboard: {
      title: '\u5de5\u4f5c\u53f0\u603b\u89c8',
      body: '\u5f53\u524d\u603b\u89c8\u6570\u636e\u5df2\u63a5\u5165\u9996\u9875\u4eea\u8868\u76d8\uff0c\u540e\u7eed\u53ef\u7ee7\u7eed\u52a0\u4e0a\u771f\u5b9e\u8fd0\u8425\u6307\u6807\u3002',
      points: ['\u4eca\u65e5\u4ea7\u51fa', '\u6700\u8fd1\u4efb\u52a1', '\u80fd\u529b\u8fb9\u754c']
    },
    materials: {
      title: '\u8bfe\u7a0b\u7d20\u6750\u4e2d\u5fc3',
      body: '\u8fd9\u91cc\u5c06\u627f\u8f7d\u9898\u5e93\u3001\u8bfe\u4ef6\u3001\u8bb2\u4e49\u3001\u5c01\u9762\u548c\u89d2\u8272\u7d20\u6750\uff0c\u4e3a\u5168\u5b66\u79d1\u751f\u4ea7\u63d0\u4f9b\u7edf\u4e00\u5165\u53e3\u3002',
      points: ['\u9898\u76ee OCR', '\u77e5\u8bc6\u70b9\u5e93', '\u89c6\u9891\u5c01\u9762\u8d44\u4ea7']
    },
    roadmap: {
      title: '\u5b66\u79d1\u80fd\u529b\u89c4\u5212',
      body: '\u4ee5\u5b66\u79d1 + \u9898\u578b + \u573a\u666f\u6a21\u677f\u7ec4\u5408\u65b9\u5f0f\u6269\u5c55\uff0c\u907f\u514d\u4ee3\u7801\u548c UI \u7ed1\u6b7b\u5728\u5355\u4e00\u6570\u5b66\u6d41\u7a0b\u91cc\u3002',
      points: ['\u6570\u5b66\u9898\u578b\u6df1\u5316', '\u82f1\u8bed\u8bfb\u89e3\u8bb2\u89e3', '\u7269\u7406\u6982\u5ff5\u52a8\u753b']
    }
  }[mode];

  return (
    <article style={{...placeholderCardStyle, borderColor: accent}}>
      <span style={{...placeholderKickerStyle, color: accent}}>COMING NEXT</span>
      <h3 style={placeholderTitleStyle}>{copy.title}</h3>
      <p style={placeholderBodyStyle}>{copy.body}</p>
      <div style={placeholderPointGridStyle}>
        {copy.points.map((point) => (
          <span key={point} style={placeholderPointStyle}>
            {point}
          </span>
        ))}
      </div>
    </article>
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

const workspaceShellStyle = {
  alignItems: 'start',
  display: 'grid',
  gap: 24,
  gridTemplateColumns: '180px minmax(0, 1fr)'
};

const projectSidebarStyle = {
  alignSelf: 'start',
  background: designTokens.colors.background.primary,
  border: `1px solid ${designTokens.colors.neutral[200]}`,
  borderRadius: designTokens.borderRadius.xl,
  boxShadow: designTokens.shadows.lg,
  display: 'grid',
  gap: 14,
  padding: designTokens.spacing[3],
  position: 'sticky' as const,
  top: 20
};

const sidebarBrandBlockStyle = {
  background: `linear-gradient(135deg, ${designTokens.colors.neutral[50]}, ${designTokens.colors.warning.bg})`,
  border: `1px solid ${designTokens.colors.neutral[200]}`,
  borderRadius: designTokens.borderRadius.lg,
  display: 'grid',
  gap: 6,
  padding: 16
};

const sidebarBrandEyebrowStyle = {
  color: designTokens.colors.brand.primary,
  fontFamily: designTokens.fonts.mono,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 2
};

const sidebarBrandTitleStyle = {
  color: designTokens.colors.neutral[900],
  fontFamily:
    '"Avenir Next", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  fontSize: designTokens.fontSize['3xl'],
  fontWeight: 800,
  fontStyle: 'normal' as const,
  lineHeight: 1
};

const sidebarBrandBodyStyle = {
  color: designTokens.colors.neutral[600],
  fontSize: 13,
  lineHeight: 1.5,
  margin: 0
};

const projectNavListStyle = {
  display: 'grid',
  gap: 10
};

const projectNavButtonStyle = {
  ...createProfessionalCardStyle('flat'),
  background: designTokens.colors.background.primary,
  border: `1px solid ${designTokens.colors.neutral[200]}`,
  borderRadius: designTokens.borderRadius.lg,
  boxShadow: 'none',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'flex-start',
  padding: '12px 14px',
  textAlign: 'left' as const,
  transition: `transform ${designTokens.transitions.base}, box-shadow ${designTokens.transitions.base}, border-color ${designTokens.transitions.base}`
};

const createActiveProjectNavButtonStyle = (accent: string) => ({
  background: designTokens.colors.neutral[50],
  border: `1px solid ${accent}`,
  boxShadow: designTokens.shadows.sm
});

const sidebarFooterStyle = {
  background: designTokens.colors.warning.bg,
  border: `1px solid ${designTokens.colors.warning.light}`,
  borderRadius: designTokens.borderRadius.lg,
  boxShadow: designTokens.shadows.sm,
  display: 'grid',
  gap: 6,
  padding: 14
};

const sidebarFooterKickerStyle = {
  color: designTokens.colors.warning.dark,
  fontFamily: designTokens.fonts.mono,
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: 1.6
};

const sidebarFooterBodyStyle = {
  color: designTokens.colors.neutral[700],
  fontSize: 13,
  lineHeight: 1.55,
  margin: 0
};

const placeholderCardStyle = {
  background: 'linear-gradient(135deg, rgba(255,250,241,0.98), rgba(255,248,223,0.95))',
  border: '3px solid #2a241d',
  borderRadius: 22,
  boxShadow: '7px 8px 0 rgba(42,36,29,0.14)',
  display: 'grid',
  gap: 14,
  padding: 24
};

const placeholderKickerStyle = {
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 13,
  fontWeight: 900,
  letterSpacing: 2
};

const placeholderTitleStyle = {
  color: '#2a241d',
  fontFamily: '"Times New Roman", Georgia, "Noto Serif SC", serif',
  fontSize: 32,
  fontStyle: 'italic' as const,
  lineHeight: 1.15,
  margin: 0
};

const placeholderBodyStyle = {
  color: '#4c4439',
  lineHeight: 1.75,
  margin: 0
};

const placeholderPointGridStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 10
};

const placeholderPointStyle = {
  background: '#fffaf1',
  border: '2px solid #4c4439',
  borderRadius: 999,
  color: '#2a241d',
  display: 'inline-flex',
  fontSize: 14,
  fontWeight: 800,
  padding: '8px 12px'
};

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
  fontFamily:
    '"Avenir Next", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  fontSize: 15,
  fontWeight: 800,
  lineHeight: 1.4,
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
  gap: designTokens.spacing[6]
};

const panelContentStyle = {
  display: 'grid',
  gap: designTokens.spacing[4]
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
  fontFamily:
    '"Avenir Next", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  fontSize: 30,
  fontWeight: 800,
  letterSpacing: '-0.03em',
  lineHeight: 1.18,
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
  ${professionalKeyframes}

  @media (max-width: 960px) {
    [data-responsive-shell="desktop-sidebar"] {
      grid-template-columns: minmax(0, 1fr) !important;
    }

    [data-saas-sidebar="project-nav"] {
      position: static !important;
    }
  }

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
