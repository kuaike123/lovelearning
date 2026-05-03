import React from 'react';

import {HomeWorkspaceSwitcher} from './HomeWorkspaceSwitcher';
import {ThemeToggle} from './ThemeToggle';
import {
  createSketchCardStyle,
  createSketchEyebrowStyle,
  createSketchGridBackground,
  createSketchPageStyle,
  createSketchPillStyle,
  sketchColors
} from './ui-primitives';
import {designTokens} from './ui-primitives-v2';

type HomeView = 'dashboard' | 'create' | 'samples' | 'jobs' | 'materials' | 'roadmap';

type HomePageProps = {
  searchParams?: Promise<{
    content?: string;
    style?: 'teacher' | 'kids' | 'exam';
    targetDurationSec?: string;
    taskName?: string;
    view?: HomeView;
    voice?: 'female_warm' | 'female_clear' | 'male_calm';
    speechRate?: 'slow' | 'normal' | 'fast';
  }>;
};

const defaultProblem = '\u89e3\u65b9\u7a0b\uff1a2x + 3 = 11';

export default async function HomePage({searchParams}: HomePageProps = {}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialContent = resolvedSearchParams?.content ?? defaultProblem;
  const initialTaskName = resolvedSearchParams?.taskName ?? '';
  const initialTargetDurationSec = parseDuration(resolvedSearchParams?.targetDurationSec);
  const initialStyle = parseStyle(resolvedSearchParams?.style);
  const initialVoice = parseVoice(resolvedSearchParams?.voice);
  const initialSpeechRate = parseSpeechRate(resolvedSearchParams?.speechRate);
  const initialView = parseView(resolvedSearchParams?.view);

  return (
    <main
      data-home-layout="workspace"
      data-home-typography="product-editorial"
      data-home-visual-system="studio-shell"
      data-sketch-portal="wireframe"
      style={sketchShellStyle}
    >
      <div style={sketchPageStyle}>
        <header
          data-home-banner="studio-hero"
          data-sketch-header="portal-title"
          style={sketchHeaderStyle}
        >
          <div style={sketchTitleBlockStyle}>
            <div style={sketchTitleRowStyle}>
              <h1 style={sketchTitleStyle}>LoveLearning AI Studio</h1>
              <span style={wireframeStampStyle}>PRODUCT BETA</span>
            </div>
            <p style={sketchSubtitleStyle}>
              {'\u4e2d\u56fd\u6559\u57f9\u56e2\u961f\u7684 AI \u8bb2\u89e3\u89c6\u9891\u5de5\u4f5c\u53f0 · \u628a\u4e00\u9053\u9898\uff0c\u505a\u6210\u4e00\u6761\u4f1a\u8bb2\u8bfe\u7684\u77ed\u89c6\u9891'}
            </p>
          </div>
          <div style={sketchHeaderMetaStyle}>
            <ThemeToggle />
            <span>{'PRODUCT NOTE / \u6559\u57f9\u89c6\u9891\u751f\u6210\u5de5\u4f5c\u53f0'}</span>
            <span>{'DATE 2026-05-03 · DEVICE DESKTOP 1440 · MODE STUDIO'}</span>
          </div>
        </header>

        <nav data-sketch-tabs="portal-sections" style={sketchTabsStyle} aria-label="LoveLearning portal sections">
          {portalTabs.map((tab) => (
            <a key={tab.code} href={tab.href} style={tab.active ? activeSketchTabStyle : sketchTabStyle}>
              <span style={sketchCheckBoxStyle} aria-hidden="true" />
              <span style={tabCodeStyle}>{tab.code}</span>
              <span>{tab.label}</span>
            </a>
          ))}
        </nav>

        <section data-sketch-canvas="home-dashboard" style={sketchCanvasStyle}>
          <aside data-home-callout="priority-focus" style={priorityCalloutStyle}>
            <span style={calloutEyebrowStyle}>PRIORITY FOCUS</span>
            <strong style={calloutTitleStyle}>
              {'\u4eca\u65e5\u91cd\u70b9\uff1a\u8ba9\u8001\u5e08\u5feb\u901f\u5f00\u59cb\u751f\u6210'}
            </strong>
            <span style={calloutBodyStyle}>
              {
                '\u6536\u655b\u9996\u9875\u5165\u53e3\u3001\u964d\u4f4e\u64cd\u4f5c\u51b3\u7b56\u6210\u672c\uff0c\u8ba9\u9996\u6b21\u4f7f\u7528\u8005\u4e5f\u80fd\u7acb\u523b\u627e\u5230\u201c\u65b0\u5efa\u8bb2\u89e3\u201d\u3002'
              }
            </span>
          </aside>
          <aside data-home-callout="roadmap-focus" style={roadmapCalloutStyle}>
            <span style={calloutEyebrowStyle}>ROADMAP FOCUS</span>
            <strong style={calloutTitleStyle}>
              {'\u4ea7\u54c1\u6536\u53e3\uff1a\u5148\u5de5\u4f5c\u53f0\uff0c\u518d\u6837\u7247\u4e0e\u4efb\u52a1'}
            </strong>
            <span style={calloutBodyStyle}>
              {
                '\u9996\u5c4f\u5148\u5efa\u7acb\u7a33\u5b9a\u7684 SaaS \u5de5\u4f5c\u53f0\u611f\uff0c\u518d\u628a\u6837\u7247\u6d4f\u89c8\u3001\u4efb\u52a1\u8ddf\u8e2a\u548c\u7d20\u6750\u4e2d\u5fc3\u9010\u6b65\u63a5\u5165\u540c\u4e00\u5957\u4ea7\u54c1\u8bed\u8a00\u3002'
              }
            </span>
          </aside>

          <div style={browserChromeStyle}>
            <span style={browserDotStyle} />
            <span style={browserDotStyle} />
            <span style={browserDotStyle} />
            <span style={browserUrlStyle}>lovelearning.ai / studio / dashboard</span>
            <span style={browserUserStyle}>teacher.ops</span>
          </div>

          <section id="generator-workbench" style={workbenchFrameStyle}>
            <HomeWorkspaceSwitcher
              dashboardSlot={<SketchDashboardOverview />}
              initialContent={initialContent}
              initialStyle={initialStyle}
              initialTargetDurationSec={initialTargetDurationSec}
              initialTaskName={initialTaskName}
              initialView={initialView}
              initialVoice={initialVoice}
              initialSpeechRate={initialSpeechRate}
            />
          </section>
        </section>
      </div>
    </main>
  );
}

const parseDuration = (value: string | undefined): 30 | 45 | 60 => {
  if (value === '30' || value === '45' || value === '60') {
    return Number(value) as 30 | 45 | 60;
  }

  return 45;
};

const parseStyle = (value: string | undefined): 'teacher' | 'kids' | 'exam' => {
  if (value === 'teacher' || value === 'kids' || value === 'exam') {
    return value;
  }

  return 'teacher';
};

const parseVoice = (
  value: string | undefined
): 'female_warm' | 'female_clear' | 'male_calm' | undefined => {
  if (value === 'female_warm' || value === 'female_clear' || value === 'male_calm') {
    return value;
  }

  return undefined;
};

const parseSpeechRate = (value: string | undefined): 'slow' | 'normal' | 'fast' | undefined => {
  if (value === 'slow' || value === 'normal' || value === 'fast') {
    return value;
  }

  return undefined;
};

const parseView = (value: string | undefined): HomeView => {
  if (
    value === 'dashboard' ||
    value === 'create' ||
    value === 'samples' ||
    value === 'jobs' ||
    value === 'materials' ||
    value === 'roadmap'
  ) {
    return value;
  }

  return 'create';
};

const portalTabs = [
  {active: false, code: '00 ALL', href: '#generator-workbench', label: '\u603b\u89c8'},
  {active: true, code: '01', href: '#generator-workbench', label: '\u65b0\u5efa\u8bb2\u89e3'},
  {active: false, code: '02', href: '/?view=samples#featured-samples', label: '\u6837\u7247\u5de5\u574a'},
  {active: false, code: '03', href: '/?view=jobs#generator-workbench', label: '\u751f\u6210\u4efb\u52a1'},
  {active: false, code: '04', href: '#subject-roadmap', label: '\u5b66\u79d1\u6269\u5c55'}
];

const sidebarItems = [
  {active: true, href: '#generator-workbench', label: '\u65b0\u5efa\u89c6\u9891'},
  {active: false, href: '/?view=samples#featured-samples', label: '\u6837\u7247\u5e93'},
  {active: false, href: '/?view=jobs#generator-workbench', label: '\u751f\u6210\u4efb\u52a1'},
  {active: false, href: '#subject-roadmap', label: '\u8bfe\u7a0b\u7d20\u6750'},
  {active: false, href: '#subject-roadmap', label: '\u5b66\u79d1\u89c4\u5212'}
];

const quickActions = [
  {
    description: '\u76f4\u63a5\u8f93\u5165\u9898\u76ee\uff0c\u751f\u6210\u8bb2\u89e3\u89c6\u9891',
    href: '/?view=create#generator-workbench',
    icon: '+',
    label: '\u65b0\u5efa\u89c6\u9891'
  },
  {
    description: '\u4ece\u6807\u51c6\u6837\u7247\u5feb\u901f\u5957\u7528\u914d\u7f6e',
    href: '/?view=samples#featured-samples',
    icon: '\u25a6',
    label: '\u4f7f\u7528\u6a21\u677f'
  },
  {
    description: '\u9884\u7559 OCR\u3001\u9898\u5e93\u548c\u8bfe\u4ef6\u5bfc\u5165\u5165\u53e3',
    href: '/?view=materials#generator-workbench',
    icon: '\u2191',
    label: '\u6279\u91cf\u5bfc\u5165'
  }
];

const kpiCards = [
  {accent: sketchColors.accent, id: 'monthly-videos', label: '\u672c\u6708\u751f\u6210', subline: '\u8f83\u4e0a\u5468 +6 \u6761', value: '24'},
  {accent: '#39708f', id: 'success-rate', label: '\u751f\u6210\u6210\u529f\u7387', subline: '\u5df2\u8fde\u7eed\u4f18\u5316 TTS', value: '92%'},
  {accent: sketchColors.accent, id: 'average-video', label: '\u5e73\u5747\u6210\u7247', subline: '\u7ad6\u5c4f\u6559\u57f9\u77ed\u89c6\u9891', value: '45s'},
  {accent: '#39708f', id: 'problem-types', label: '\u5df2\u652f\u6301\u9898\u578b', subline: '\u65b9\u7a0b + \u6570\u91cf\u5173\u7cfb', value: '2'}
];

const subjectBars = [
  {height: '52%', label: '\u65b9'},
  {height: '68%', label: '\u5e94'},
  {height: '34%', label: '\u51e0'},
  {height: '18%', label: '\u51fd'}
];

function SketchDashboardOverview() {
  return (
    <section data-dashboard-typography="product-editorial" data-sketch-overview="dashboard" style={overviewStyle}>
      <div style={overviewHeadingStyle}>
        <span style={overviewKickerStyle}>{'\u6b22\u8fce\u56de\u6765'}</span>
        <h2 style={overviewTitleStyle}>{'\u4eca\u5929\u51c6\u5907\u751f\u6210\u54ea\u6761\u8bb2\u89e3\u89c6\u9891\uff1f'}</h2>
        <p style={overviewBodyStyle}>
          {'\u8fd9\u4e00\u5c42\u4f5c\u4e3a\u6559\u6848\u5de5\u4f5c\u53f0\u7684\u603b\u89c8\uff1a\u5148\u770b\u4ea7\u51fa\u3001\u80fd\u529b\u548c\u4e0b\u4e00\u6b65\uff0c\u518d\u8fdb\u5165\u65b0\u5efa\u89c6\u9891\u3001\u5185\u5bb9\u6837\u7247\u6d41\u6216\u4efb\u52a1\u3002'}
        </p>
      </div>

      <section data-dashboard-quick-actions="primary" style={quickActionsStyle}>
        <div style={quickActionsHeaderStyle}>
          <span style={quickActionsKickerStyle}>{'\u5feb\u901f\u64cd\u4f5c'}</span>
          <strong style={quickActionsTitleStyle}>{'\u5e38\u7528\u5165\u53e3\u76f4\u63a5\u5f00\u59cb'}</strong>
        </div>
        <div style={quickActionsGridStyle}>
          {quickActions.map((action) => (
            <a key={action.label} href={action.href} style={quickActionCardStyle}>
              <span style={quickActionIconStyle}>{action.icon}</span>
              <span style={quickActionTextStyle}>
                <strong style={quickActionLabelStyle}>{action.label}</strong>
                <span style={quickActionDescriptionStyle}>{action.description}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <div style={kpiGridStyle}>
        {kpiCards.map((card) => (
          <article key={card.id} data-sketch-kpi={card.id} style={sketchKpiCardStyle}>
            <span style={kpiLabelStyle}>{card.label}</span>
            <strong style={{...kpiValueStyle, color: card.accent}}>{card.value}</strong>
            <span style={kpiSublineStyle}>{card.subline}</span>
          </article>
        ))}
      </div>

      <div style={chartGridStyle}>
        <article data-sketch-chart="generation-trend" style={sketchChartCardStyle}>
          <h3 style={chartTitleStyle}>{'CHART · \u6700\u8fd1\u751f\u6210\u8d8b\u52bf'}</h3>
          <svg aria-hidden="true" viewBox="0 0 520 210" style={chartSvgStyle}>
            <path d="M54 24V172H486" fill="none" stroke="#2a241d" strokeWidth="2.5" />
            <path
              d="M58 146 C118 132, 138 126, 194 124 S284 102, 334 82 S428 56, 472 36"
              fill="none"
              stroke="#d9482e"
              strokeLinecap="round"
              strokeWidth="4"
            />
            {[118, 232, 344, 472].map((cx, index) => (
              <circle key={cx} cx={cx} cy={[132, 114, 78, 36][index]} fill="#d9482e" r="7" />
            ))}
          </svg>
        </article>

        <article data-sketch-chart="subject-coverage" id="subject-roadmap" style={sketchChartCardStyle}>
          <h3 style={chartTitleStyle}>{'SUBJECTS · \u9898\u578b\u8986\u76d6'}</h3>
          <div style={barChartStyle}>
            {subjectBars.map((bar) => (
              <div key={bar.label} style={barItemStyle}>
                <span style={{...barFillStyle, height: bar.height}} />
                <span style={barLabelStyle}>{bar.label}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <section style={nextStepStyle}>
        <h3 style={nextStepTitleStyle}>{'NEXT STEP / \u4e0b\u4e00\u6b65\u5efa\u8bae'}</h3>
        <ul style={nextStepListStyle}>
          <li>{'\u5b8c\u5584\u65b0\u5efa\u89c6\u9891\u7684\u8349\u7a3f\u7eb8\u8868\u5355\u6837\u5f0f'}</li>
          <li>{'\u628a\u6837\u7247\u5e93\u6539\u6210\u6559\u57f9\u77ed\u89c6\u9891\u6837\u7247\u5899'}</li>
          <li>{'\u5c06\u4efb\u52a1\u8be6\u60c5\u9875\u8fc1\u79fb\u4e3a\u4ea4\u4ed8\u68c0\u67e5\u5355'}</li>
        </ul>
      </section>
    </section>
  );
}

const sketchShellStyle = {
  background:
    'radial-gradient(circle at 10% 8%, rgba(217,72,46,0.05), transparent 26%), linear-gradient(180deg, #f8f1e4 0%, #fbf6ec 100%)',
  color: sketchColors.ink,
  minHeight: '100vh',
  padding: '38px 22px 80px'
};

const sketchPageStyle = {
  display: 'grid',
  gap: 24,
  margin: '0 auto',
  maxWidth: 1360
};

const sketchHeaderStyle = {
  alignItems: 'end',
  borderBottom: `3px solid ${sketchColors.ink}`,
  display: 'grid',
  gap: 24,
  gridTemplateColumns: 'minmax(0, 1.2fr) minmax(300px, 0.8fr)',
  paddingBottom: 18
};

const sketchTitleBlockStyle = {
  display: 'grid',
  gap: 10
};

const sketchTitleRowStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 18
};

const sketchTitleStyle = {
  color: sketchColors.ink,
  fontFamily:
    '"Avenir Next", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  fontSize: 54,
  fontWeight: 800,
  letterSpacing: '-0.04em',
  lineHeight: 1,
  margin: 0
};

const wireframeStampStyle = {
  border: `2px dashed ${sketchColors.accent}`,
  color: sketchColors.accent,
  display: 'inline-flex',
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 14,
  fontWeight: 800,
  letterSpacing: 2.6,
  padding: '8px 14px',
  transform: 'rotate(-1deg)'
};

const sketchSubtitleStyle = {
  color: designTokens.colors.neutral[600],
  fontSize: 17,
  letterSpacing: 0.2,
  lineHeight: 1.7,
  margin: 0
};

const sketchHeaderMetaStyle = {
  color: '#4f473d',
  display: 'grid',
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 13,
  gap: 8,
  fontWeight: 800,
  justifyItems: 'end',
  letterSpacing: 1.8,
  textAlign: 'right' as const
};

const sketchTabsStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 14,
  padding: '10px 4px 4px'
};

const sketchTabStyle = {
  alignItems: 'center',
  color: sketchColors.ink,
  display: 'inline-flex',
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 15,
  gap: 9,
  padding: '9px 12px',
  position: 'relative' as const,
  textDecoration: 'none'
};

const activeSketchTabStyle = {
  ...sketchTabStyle,
  background: sketchColors.warm,
  fontWeight: 800,
  transform: 'rotate(-0.6deg)'
};

const sketchCheckBoxStyle = {
  border: `2px solid ${sketchColors.ink}`,
  display: 'inline-flex',
  height: 16,
  width: 16
};

const tabCodeStyle = {
  border: `2px solid ${sketchColors.ink}`,
  display: 'inline-flex',
  fontSize: 13,
  padding: '4px 8px'
};

const sketchCanvasStyle = {
  background: createSketchGridBackground('#f8f1e4', '0.07'),
  backgroundSize: '24px 24px',
  border: `4px solid ${sketchColors.ink}`,
  borderRadius: 24,
  boxShadow: '8px 10px 0 rgba(42,36,29,0.16)',
  display: 'grid',
  gap: 20,
  minHeight: 760,
  overflow: 'hidden',
  padding: '92px 28px 28px',
  position: 'relative' as const
};

const sharedCalloutStyle = {
  backdropFilter: 'blur(16px)',
  background: 'rgba(255,255,255,0.92)',
  border: `1px solid ${designTokens.colors.neutral[200]}`,
  borderRadius: 22,
  boxShadow: '0 18px 38px rgba(15, 23, 42, 0.12)',
  color: sketchColors.ink,
  display: 'grid',
  gap: 10,
  maxWidth: 320,
  padding: '18px 20px',
  position: 'absolute' as const,
  zIndex: 2
};

const priorityCalloutStyle = {
  ...sharedCalloutStyle,
  right: 42,
  top: 26
};

const roadmapCalloutStyle = {
  ...sharedCalloutStyle,
  bottom: 500,
  maxWidth: 300,
  right: 116
};

const calloutEyebrowStyle = {
  color: designTokens.colors.brand.primary,
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 2.2
};

const calloutTitleStyle = {
  color: designTokens.colors.neutral[900],
  fontFamily:
    '"Avenir Next", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  fontSize: 16,
  fontWeight: 800,
  letterSpacing: '-0.01em',
  lineHeight: 1.5
};

const calloutBodyStyle = {
  color: designTokens.colors.neutral[600],
  fontSize: 13,
  lineHeight: 1.7
};

const browserChromeStyle = {
  alignItems: 'center',
  background: 'rgba(255,250,241,0.9)',
  border: `3px solid ${sketchColors.muted}`,
  borderRadius: 999,
  display: 'grid',
  gap: 10,
  gridTemplateColumns: 'auto auto auto 1fr auto',
  padding: '11px 18px',
  position: 'relative' as const,
  zIndex: 1
};

const browserDotStyle = {
  border: `2px solid ${sketchColors.muted}`,
  borderRadius: 999,
  display: 'inline-flex',
  height: 12,
  width: 12
};

const browserUrlStyle = {
  color: '#4f473d',
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 14,
  marginLeft: 8
};

const browserUserStyle = {
  color: '#4f473d',
  fontSize: 14,
  fontWeight: 700
};

const sketchCanvasGridStyle = {
  alignItems: 'start',
  display: 'grid',
  gap: 28,
  gridTemplateColumns: '230px minmax(0, 1fr)'
};

const sketchSidebarStyle = {
  display: 'grid',
  gap: 18,
  paddingTop: 12
};

const sidebarBrandStyle = {
  borderBottom: `3px solid ${sketchColors.ink}`,
  color: sketchColors.ink,
  fontFamily: '"Times New Roman", Georgia, "Noto Serif SC", serif',
  fontSize: 36,
  fontStyle: 'italic' as const,
  margin: 0,
  paddingBottom: 6,
  width: 'fit-content'
};

const sidebarItemStyle = {
  alignItems: 'center',
  color: sketchColors.ink,
  display: 'inline-flex',
  fontSize: 18,
  gap: 12,
  textDecoration: 'none'
};

const activeSidebarItemStyle = {
  ...sidebarItemStyle,
  background: sketchColors.warm,
  fontWeight: 800,
  padding: '4px 8px',
  transform: 'rotate(-0.4deg)',
  width: 'fit-content'
};

const dashboardAreaStyle = {
  display: 'grid',
  gap: 24
};

const overviewStyle = {
  display: 'grid',
  gap: 20
};

const overviewHeadingStyle = {
  display: 'grid',
  gap: 6,
  maxWidth: 820
};

const overviewKickerStyle = {
  color: '#6f665b',
  fontSize: 14,
  letterSpacing: 2
};

const overviewTitleStyle = {
  color: sketchColors.ink,
  fontFamily:
    '"Avenir Next", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  fontSize: 36,
  fontWeight: 800,
  letterSpacing: '-0.03em',
  lineHeight: 1.12,
  margin: 0
};

const overviewBodyStyle = {
  color: designTokens.colors.neutral[600],
  fontSize: 16,
  lineHeight: 1.7,
  margin: 0
};

const quickActionsStyle = {
  background: 'rgba(255,250,241,0.92)',
  border: `3px solid ${sketchColors.ink}`,
  borderRadius: 18,
  boxShadow: '6px 6px 0 rgba(42,36,29,0.14)',
  display: 'grid',
  gap: 14,
  padding: 18
};

const quickActionsHeaderStyle = {
  alignItems: 'end',
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 10,
  justifyContent: 'space-between'
};

const quickActionsKickerStyle = {
  color: sketchColors.accent,
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 13,
  fontWeight: 900,
  letterSpacing: 2
};

const quickActionsTitleStyle = {
  color: sketchColors.ink,
  fontSize: 18
};

const quickActionsGridStyle = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
};

const quickActionCardStyle = {
  alignItems: 'center',
  background: '#fff8df',
  border: `2px solid ${sketchColors.muted}`,
  borderRadius: 14,
  color: sketchColors.ink,
  display: 'flex',
  gap: 12,
  padding: 14,
  textDecoration: 'none'
};

const quickActionIconStyle = {
  alignItems: 'center',
  background: sketchColors.accent,
  borderRadius: 999,
  color: '#fff8df',
  display: 'inline-flex',
  flexShrink: 0,
  fontSize: 20,
  fontWeight: 900,
  height: 42,
  justifyContent: 'center',
  width: 42
};

const quickActionTextStyle = {
  display: 'grid',
  gap: 4
};

const quickActionLabelStyle = {
  color: sketchColors.ink,
  fontSize: 16
};

const quickActionDescriptionStyle = {
  color: sketchColors.muted,
  fontSize: 13,
  lineHeight: 1.5
};

const kpiGridStyle = {
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
};

const sketchKpiCardStyle = {
  ...createSketchCardStyle({tone: 'paper'}),
  borderColor: sketchColors.muted,
  gap: 8,
  minHeight: 128,
  padding: 18,
  transform: 'rotate(-0.4deg)'
};

const kpiLabelStyle = {
  color: sketchColors.muted,
  fontSize: 15,
  letterSpacing: 1.4
};

const kpiValueStyle = {
  fontFamily:
    '"Avenir Next", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  fontSize: 52,
  fontWeight: 800,
  letterSpacing: '-0.04em',
  lineHeight: 1
};

const kpiSublineStyle = {
  color: sketchColors.muted,
  fontSize: 13
};

const chartGridStyle = {
  display: 'grid',
  gap: 18,
  gridTemplateColumns: 'minmax(0, 1.25fr) minmax(260px, 0.75fr)'
};

const sketchChartCardStyle = {
  ...createSketchCardStyle({tone: 'paper'}),
  borderColor: sketchColors.muted,
  gap: 12,
  minHeight: 250,
  padding: 20
};

const chartTitleStyle = {
  color: '#4f473d',
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 18,
  letterSpacing: 2.4,
  margin: 0
};

const chartSvgStyle = {
  height: '100%',
  minHeight: 188,
  width: '100%'
};

const barChartStyle = {
  alignItems: 'end',
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(4, 1fr)',
  minHeight: 190,
  padding: '18px 8px 0'
};

const barItemStyle = {
  alignItems: 'center',
  display: 'grid',
  gap: 8,
  height: '100%',
  justifyItems: 'center'
};

const barFillStyle = {
  background:
    'repeating-linear-gradient(135deg, rgba(42,36,29,0.92) 0 2px, transparent 2px 7px), rgba(255,250,241,0.9)',
  border: '3px solid #4c4439',
  display: 'block',
  marginTop: 'auto',
  width: '70%'
};

const barLabelStyle = {
  color: '#4f473d',
  fontSize: 14,
  fontWeight: 800
};

const nextStepStyle = {
  ...createSketchCardStyle({tone: 'paper'}),
  border: `3px solid ${sketchColors.accent}`,
  gap: 12,
  padding: 18
};

const nextStepTitleStyle = {
  borderBottom: `3px solid ${sketchColors.ink}`,
  color: sketchColors.accent,
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 18,
  letterSpacing: 2.4,
  margin: 0,
  paddingBottom: 10
};

const nextStepListStyle = {
  color: sketchColors.ink,
  lineHeight: 1.8,
  margin: 0,
  paddingLeft: 22
};

const workbenchFrameStyle = {
  border: `3px dashed ${sketchColors.muted}`,
  borderRadius: 18,
  display: 'grid',
  gap: 18,
  padding: 18
};

const workbenchIntroStyle = {
  display: 'grid',
  gap: 8
};

const sectionEyebrowStyle = {
  color: sketchColors.accent,
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 2,
  margin: 0
};

const sectionTitleStyle = {
  color: sketchColors.ink,
  fontFamily:
    '"Avenir Next", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  fontSize: 30,
  fontWeight: 800,
  letterSpacing: '-0.03em',
  lineHeight: 1.15,
  margin: 0
};

const sectionDescriptionStyle = {
  color: sketchColors.muted,
  lineHeight: 1.75,
  margin: 0
};
