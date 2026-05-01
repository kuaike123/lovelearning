import React from 'react';

import {HomeWorkspaceSwitcher} from './HomeWorkspaceSwitcher';

type HomePageProps = {
  searchParams?: Promise<{
    content?: string;
    style?: 'teacher' | 'kids' | 'exam';
    targetDurationSec?: string;
    taskName?: string;
    view?: 'create' | 'samples' | 'jobs';
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
    <main data-home-layout="workspace" data-sketch-portal="wireframe" style={sketchShellStyle}>
      <div style={sketchPageStyle}>
        <header data-sketch-header="portal-title" style={sketchHeaderStyle}>
          <div style={sketchTitleBlockStyle}>
            <div style={sketchTitleRowStyle}>
              <h1 style={sketchTitleStyle}>LoveLearning AI · Portal</h1>
              <span style={wireframeStampStyle}>WIREFRAME V1</span>
            </div>
            <p style={sketchSubtitleStyle}>
              {'\u4e2d\u56fd\u6559\u57f9\u56e2\u961f\u7684 AI \u8bb2\u89e3\u89c6\u9891\u5de5\u4f5c\u53f0 · \u628a\u4e00\u9053\u9898\uff0c\u505a\u6210\u4e00\u6761\u4f1a\u8bb2\u8bfe\u7684\u77ed\u89c6\u9891'}
            </p>
          </div>
          <div style={sketchHeaderMetaStyle}>
            <span>{'DESIGN NOTE / \u6559\u6848\u5de5\u4f5c\u53f0\u8349\u56fe'}</span>
            <span>{'DATE 2026-05-01 · DEVICE DESKTOP 1440 · FIDELITY LOW'}</span>
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
          <aside style={yellowStickyNoteStyle}>
            {'\u4eca\u5929\u4f18\u5148\u505a\uff1a\u8ba9\u8001\u5e08\u4e00\u773c\u77e5\u9053\u4ece\u54ea\u91cc\u5f00\u59cb\u751f\u6210'}
          </aside>
          <aside style={pinkStickyNoteStyle}>
            {'page-1 / \u5148\u628a\u9996\u9875\u6539\u6210\u6559\u6848\u5de5\u4f5c\u53f0\uff0c\u518d\u8fc1\u79fb\u6837\u7247\u548c\u4efb\u52a1\u9875\u3002'}
          </aside>

          <div style={browserChromeStyle}>
            <span style={browserDotStyle} />
            <span style={browserDotStyle} />
            <span style={browserDotStyle} />
            <span style={browserUrlStyle}>lovelearning.ai / portal / dashboard</span>
            <span style={browserUserStyle}>teacher.ops</span>
          </div>

          <div style={sketchCanvasGridStyle}>
            <aside data-sketch-sidebar="portal-nav" style={sketchSidebarStyle}>
              <h2 style={sidebarBrandStyle}>全科 AI</h2>
              {sidebarItems.map((item) => (
                <a key={item.label} href={item.href} style={item.active ? activeSidebarItemStyle : sidebarItemStyle}>
                  <span style={sketchCheckBoxStyle} aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              ))}
            </aside>

            <section style={dashboardAreaStyle}>
              <SketchDashboardOverview />

              <section id="generator-workbench" style={workbenchFrameStyle}>
                <div style={workbenchIntroStyle}>
                  <p style={sectionEyebrowStyle}>{'\u5de5\u4f5c\u53f0\u5165\u53e3'}</p>
                  <h2 style={sectionTitleStyle}>{'\u521b\u4f5c\u3001\u6837\u7247\u3001\u8fdb\u5ea6\u4e09\u4e2a\u5165\u53e3\uff0c\u4e0d\u518d\u6324\u5728\u4e00\u5c4f\u91cc'}</h2>
                  <p style={sectionDescriptionStyle}>
                    {'\u9996\u9875\u5148\u505a\u51b3\u7b56\u5206\u6d41\uff1a\u8981\u751f\u6210\u65b0\u89c6\u9891\u3001\u8981\u6d4f\u89c8\u6837\u7247\u6d41\uff0c\u8fd8\u662f\u8981\u56de\u770b\u4efb\u52a1\u8fdb\u5ea6\uff0c\u90fd\u80fd\u7528\u4e00\u4e2a\u660e\u786e\u5165\u53e3\u5f00\u59cb\u3002'}
                  </p>
                </div>
                <HomeWorkspaceSwitcher
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

const parseView = (value: string | undefined): 'create' | 'samples' | 'jobs' => {
  if (value === 'create' || value === 'samples' || value === 'jobs') {
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

const kpiCards = [
  {accent: '#d9482e', id: 'monthly-videos', label: '\u672c\u6708\u751f\u6210', subline: '\u8f83\u4e0a\u5468 +6 \u6761', value: '24'},
  {accent: '#39708f', id: 'success-rate', label: '\u751f\u6210\u6210\u529f\u7387', subline: '\u5df2\u8fde\u7eed\u4f18\u5316 TTS', value: '92%'},
  {accent: '#d9482e', id: 'average-video', label: '\u5e73\u5747\u6210\u7247', subline: '\u7ad6\u5c4f\u6559\u57f9\u77ed\u89c6\u9891', value: '45s'},
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
    <section data-sketch-overview="dashboard" style={overviewStyle}>
      <div style={overviewHeadingStyle}>
        <span style={overviewKickerStyle}>{'\u6b22\u8fce\u56de\u6765'}</span>
        <h2 style={overviewTitleStyle}>{'\u4eca\u5929\u51c6\u5907\u751f\u6210\u54ea\u6761\u8bb2\u89e3\u89c6\u9891\uff1f'}</h2>
        <p style={overviewBodyStyle}>
          {'\u8fd9\u4e00\u5c42\u4f5c\u4e3a\u6559\u6848\u5de5\u4f5c\u53f0\u7684\u603b\u89c8\uff1a\u5148\u770b\u4ea7\u51fa\u3001\u80fd\u529b\u548c\u4e0b\u4e00\u6b65\uff0c\u518d\u8fdb\u5165\u65b0\u5efa\u89c6\u9891\u3001\u5185\u5bb9\u6837\u7247\u6d41\u6216\u4efb\u52a1\u3002'}
        </p>
      </div>

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
  color: '#2a241d',
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
  borderBottom: '3px solid #2a241d',
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
  color: '#2a241d',
  fontFamily: '"Times New Roman", Georgia, "Noto Serif SC", serif',
  fontSize: 58,
  fontStyle: 'italic' as const,
  fontWeight: 900,
  letterSpacing: -1.4,
  lineHeight: 0.95,
  margin: 0
};

const wireframeStampStyle = {
  border: '2px dashed #d9482e',
  color: '#d9482e',
  display: 'inline-flex',
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 14,
  fontWeight: 800,
  letterSpacing: 2.6,
  padding: '8px 14px',
  transform: 'rotate(-1deg)'
};

const sketchSubtitleStyle = {
  color: '#5f564a',
  fontSize: 17,
  letterSpacing: 0.8,
  lineHeight: 1.65,
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
  color: '#2a241d',
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
  background: '#ffd76a',
  fontWeight: 800,
  transform: 'rotate(-0.6deg)'
};

const sketchCheckBoxStyle = {
  border: '2px solid #2a241d',
  display: 'inline-flex',
  height: 16,
  width: 16
};

const tabCodeStyle = {
  border: '2px solid #2a241d',
  display: 'inline-flex',
  fontSize: 13,
  padding: '4px 8px'
};

const sketchCanvasStyle = {
  background:
    'linear-gradient(#e8ddbf 1px, transparent 1px), linear-gradient(90deg, #e8ddbf 1px, transparent 1px), #f8f1e4',
  backgroundSize: '24px 24px',
  border: '4px solid #2a241d',
  borderRadius: 24,
  boxShadow: '8px 10px 0 rgba(42,36,29,0.16)',
  display: 'grid',
  gap: 20,
  minHeight: 760,
  overflow: 'hidden',
  padding: '92px 28px 28px',
  position: 'relative' as const
};

const yellowStickyNoteStyle = {
  background: '#fff096',
  boxShadow: '10px 10px 0 rgba(42,36,29,0.14)',
  color: '#2a241d',
  fontSize: 16,
  lineHeight: 1.55,
  maxWidth: 300,
  padding: '18px 20px',
  position: 'absolute' as const,
  right: 54,
  top: 28,
  transform: 'rotate(2.3deg)',
  zIndex: 2
};

const pinkStickyNoteStyle = {
  ...yellowStickyNoteStyle,
  background: '#ffd2c5',
  bottom: 500,
  maxWidth: 270,
  right: 130,
  top: 'auto',
  transform: 'rotate(-4deg)'
};

const browserChromeStyle = {
  alignItems: 'center',
  background: 'rgba(255,250,241,0.9)',
  border: '3px solid #4c4439',
  borderRadius: 999,
  display: 'grid',
  gap: 10,
  gridTemplateColumns: 'auto auto auto 1fr auto',
  padding: '11px 18px',
  position: 'relative' as const,
  zIndex: 1
};

const browserDotStyle = {
  border: '2px solid #4c4439',
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
  borderBottom: '3px solid #2a241d',
  color: '#2a241d',
  fontFamily: '"Times New Roman", Georgia, "Noto Serif SC", serif',
  fontSize: 36,
  fontStyle: 'italic' as const,
  margin: 0,
  paddingBottom: 6,
  width: 'fit-content'
};

const sidebarItemStyle = {
  alignItems: 'center',
  color: '#2a241d',
  display: 'inline-flex',
  fontSize: 18,
  gap: 12,
  textDecoration: 'none'
};

const activeSidebarItemStyle = {
  ...sidebarItemStyle,
  background: '#ffd76a',
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
  color: '#2a241d',
  fontFamily: '"Times New Roman", Georgia, "Noto Serif SC", serif',
  fontSize: 38,
  fontStyle: 'italic' as const,
  lineHeight: 1.1,
  margin: 0
};

const overviewBodyStyle = {
  color: '#5f564a',
  fontSize: 16,
  lineHeight: 1.7,
  margin: 0
};

const kpiGridStyle = {
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'
};

const sketchKpiCardStyle = {
  background: 'rgba(255,250,241,0.9)',
  border: '3px solid #4c4439',
  borderRadius: 14,
  display: 'grid',
  gap: 8,
  minHeight: 128,
  padding: 18,
  transform: 'rotate(-0.4deg)'
};

const kpiLabelStyle = {
  color: '#4f473d',
  fontSize: 15,
  letterSpacing: 1.4
};

const kpiValueStyle = {
  fontFamily: '"Times New Roman", Georgia, "Noto Serif SC", serif',
  fontSize: 54,
  lineHeight: 0.95
};

const kpiSublineStyle = {
  color: '#5f564a',
  fontSize: 13
};

const chartGridStyle = {
  display: 'grid',
  gap: 18,
  gridTemplateColumns: 'minmax(0, 1.25fr) minmax(260px, 0.75fr)'
};

const sketchChartCardStyle = {
  background: 'rgba(255,250,241,0.92)',
  border: '3px solid #4c4439',
  borderRadius: 16,
  display: 'grid',
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
  background: 'rgba(255,250,241,0.88)',
  border: '3px solid #d9482e',
  borderRadius: 14,
  display: 'grid',
  gap: 12,
  padding: 18
};

const nextStepTitleStyle = {
  borderBottom: '3px solid #2a241d',
  color: '#d9482e',
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 18,
  letterSpacing: 2.4,
  margin: 0,
  paddingBottom: 10
};

const nextStepListStyle = {
  color: '#2a241d',
  lineHeight: 1.8,
  margin: 0,
  paddingLeft: 22
};

const workbenchFrameStyle = {
  border: '3px dashed #4c4439',
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
  color: '#d9482e',
  fontFamily: 'Consolas, "Courier New", monospace',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 2,
  margin: 0
};

const sectionTitleStyle = {
  color: '#2a241d',
  fontFamily: '"Times New Roman", Georgia, "Noto Serif SC", serif',
  fontSize: 32,
  fontStyle: 'italic' as const,
  lineHeight: 1.15,
  margin: 0
};

const sectionDescriptionStyle = {
  color: '#5f564a',
  lineHeight: 1.75,
  margin: 0
};
