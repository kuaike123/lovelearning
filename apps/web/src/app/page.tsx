import React from 'react';

import {HomeWorkspaceSwitcher} from './HomeWorkspaceSwitcher';
import {
  appShellStyle,
  contentShellStyle,
  sectionIntroStyle as sharedSectionIntroStyle
} from './ui-primitives';

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
    <main data-home-layout="workspace" style={appShellStyle}>
      <div style={contentShellStyle}>
        <section style={heroStyle}>
          <div style={heroBackgroundMarkStyle} aria-hidden="true" />
          <div style={heroContentStyle}>
            <p style={heroEyebrowStyle}>{'\u4e2d\u56fd\u6559\u57f9\u56e2\u961f\u7684 AI \u8bb2\u89e3\u89c6\u9891\u5de5\u4f5c\u53f0'}</p>
            <h1 style={heroTitleStyle}>{'\u628a\u4e00\u9053\u9898\uff0c\u505a\u6210\u4e00\u6761\u4f1a\u8bb2\u8bfe\u7684\u77ed\u89c6\u9891'}</h1>
            <p style={heroDescriptionStyle}>
              {
                '\u521b\u4f5c\u3001\u6837\u7247\u3001\u8fdb\u5ea6\u4e09\u4e2a\u5165\u53e3\u6536\u62e2\u5230\u4e00\u4e2a\u6e05\u6670\u5de5\u4f5c\u53f0\uff0c\u8ba9\u8001\u5e08\u548c\u8fd0\u8425\u540c\u5b66\u53ef\u4ee5\u4ece\u9898\u76ee\u5feb\u901f\u4ea7\u51fa\u5e26\u914d\u97f3\u3001\u5b57\u5e55\u548c\u52a8\u753b\u6b65\u9aa4\u7684\u6559\u57f9\u77ed\u89c6\u9891\u3002'
              }
            </p>
            <div style={heroProofRowStyle}>
              <span style={heroProofPillStyle}>{'\u521d\u4e2d\u6570\u5b66\u5df2\u8dd1\u901a'}</span>
              <span style={heroProofPillStyle}>{'\u652f\u6301 TTS \u914d\u97f3'}</span>
              <span style={heroProofPillStyle}>{'\u9884\u7559\u5168\u5b66\u79d1\u6269\u5c55'}</span>
            </div>
          </div>
          <div style={heroStatsGridStyle}>
            <article style={heroStatCardStyle}>
              <span style={heroStatLabelStyle}>{'\u5185\u5bb9\u751f\u4ea7'}</span>
              <strong style={heroStatValueStyle}>{'\u9898\u76ee \u2192 \u811a\u672c \u2192 \u89c6\u9891'}</strong>
              <p style={heroStatBodyStyle}>{'\u5148\u628a\u9898\u76ee\u53d8\u6210\u6559\u5b66\u6b65\u9aa4\uff0c\u518d\u8fdb\u5165\u914d\u97f3\u3001\u5b57\u5e55\u548c Remotion \u6e32\u67d3\u3002'}</p>
            </article>
            <article style={heroStatCardStyle}>
              <span style={heroStatLabelStyle}>{'\u5185\u5bb9\u6837\u7247\u6d41'}</span>
              <strong style={heroStatValueStyle}>{'\u5148\u770b\u6548\u679c\uff0c\u518d\u4e00\u952e\u5957\u7528'}</strong>
              <p style={heroStatBodyStyle}>{'\u7528\u62db\u751f\u3001\u9519\u9898\u3001\u8bfe\u5802\u573a\u666f\u7ec4\u7ec7\u6837\u7247\uff0c\u8ba9\u7528\u6237\u5148\u88ab\u6210\u7247\u6253\u52a8\u3002'}</p>
            </article>
            <article style={heroStatCardStyle}>
              <span style={heroStatLabelStyle}>{'\u4efb\u52a1\u4ea4\u4ed8'}</span>
              <strong style={heroStatValueStyle}>{'\u8fdb\u5ea6\u3001\u6210\u7247\u3001\u7d20\u6750\u4e00\u5904\u67e5\u770b'}</strong>
              <p style={heroStatBodyStyle}>{'\u7ed3\u679c\u9875\u6309\u751f\u6210\u8def\u5f84\u548c\u4ea4\u4ed8\u7269\u7ec4\u7ec7\uff0c\u66f4\u63a5\u8fd1\u771f\u5b9e\u4ea7\u54c1\u4f7f\u7528\u573a\u666f\u3002'}</p>
            </article>
          </div>
          <div style={heroActionRowStyle}>
            <a href="#generator-workbench" style={primaryHeroActionStyle}>
              {'\u5f00\u59cb\u751f\u6210'}
            </a>
            <a href="#featured-samples" style={secondaryHeroActionStyle}>
              {'\u6d4f\u89c8\u6837\u7247\u5e93'}
            </a>
          </div>
        </section>

        <section id="generator-workbench" style={sharedSectionIntroStyle}>
          <p style={sectionEyebrowStyle}>{'\u5de5\u4f5c\u53f0\u5165\u53e3'}</p>
          <h2 style={sectionTitleStyle}>{'\u521b\u4f5c\u3001\u6837\u7247\u3001\u8fdb\u5ea6\u4e09\u4e2a\u5165\u53e3\uff0c\u4e0d\u518d\u6324\u5728\u4e00\u5c4f\u91cc'}</h2>
          <p style={sectionDescriptionStyle}>
            {'\u9996\u9875\u5148\u505a\u51b3\u7b56\u5206\u6d41\uff1a\u8981\u751f\u6210\u65b0\u89c6\u9891\u3001\u8981\u6d4f\u89c8\u6837\u7247\u6d41\uff0c\u8fd8\u662f\u8981\u56de\u770b\u4efb\u52a1\u8fdb\u5ea6\uff0c\u90fd\u80fd\u7528\u4e00\u4e2a\u660e\u786e\u5165\u53e3\u5f00\u59cb\u3002'}
          </p>
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

const heroStyle = {
  background:
    'radial-gradient(circle at 88% 12%, rgba(255, 36, 66, 0.11), transparent 28%), linear-gradient(135deg, #fffaf1 0%, #ffffff 52%, #f6efdd 100%)',
  border: '1px solid #eadfca',
  borderRadius: 34,
  boxShadow: '0 24px 70px rgba(28, 26, 23, 0.08)',
  color: '#1c1a17',
  display: 'grid',
  gap: 22,
  overflow: 'hidden',
  padding: '34px 30px',
  position: 'relative' as const
};

const heroBackgroundMarkStyle = {
  background: 'linear-gradient(135deg, rgba(16, 42, 67, 0.08), rgba(255, 36, 66, 0.1))',
  border: '1px solid rgba(16, 42, 67, 0.08)',
  borderRadius: 999,
  height: 180,
  position: 'absolute' as const,
  right: -52,
  top: -72,
  width: 180
};

const heroContentStyle = {
  display: 'grid',
  gap: 12,
  maxWidth: 820
};

const heroEyebrowStyle = {
  color: '#c0512f',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 1.8,
  margin: 0
};

const heroTitleStyle = {
  color: '#1c1a17',
  fontFamily: '"Times New Roman", Georgia, "Noto Serif SC", serif',
  fontSize: 50,
  lineHeight: 1.08,
  margin: 0,
  maxWidth: 880
};

const heroDescriptionStyle = {
  color: '#4b5563',
  fontSize: 17,
  lineHeight: 1.75,
  margin: 0,
  maxWidth: 820
};

const heroProofRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 10,
  marginTop: 4
};

const heroProofPillStyle = {
  background: '#fff4f0',
  border: '1px solid rgba(192, 81, 47, 0.18)',
  borderRadius: 999,
  color: '#8f3c22',
  display: 'inline-flex',
  fontSize: 13,
  fontWeight: 800,
  padding: '7px 12px'
};

const heroStatsGridStyle = {
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
};

const heroStatCardStyle = {
  background: 'rgba(255,255,255,0.72)',
  border: '1px solid #eadfca',
  borderRadius: 24,
  display: 'grid',
  gap: 8,
  padding: 18,
  position: 'relative' as const
};

const heroStatLabelStyle = {
  color: '#c0512f',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.2
};

const heroStatValueStyle = {
  color: '#102a43',
  fontSize: 20,
  lineHeight: 1.3
};

const heroStatBodyStyle = {
  color: '#5f5a53',
  lineHeight: 1.65,
  margin: 0
};

const heroActionRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 12
};

const primaryHeroActionStyle = {
  background: '#c0512f',
  borderRadius: 999,
  color: '#fffaf1',
  display: 'inline-flex',
  fontWeight: 800,
  justifyContent: 'center',
  padding: '12px 18px',
  textDecoration: 'none'
};

const secondaryHeroActionStyle = {
  background: '#ffffff',
  border: '1px solid #eadfca',
  borderRadius: 999,
  color: '#102a43',
  display: 'inline-flex',
  fontWeight: 700,
  justifyContent: 'center',
  padding: '12px 18px',
  textDecoration: 'none'
};

const sectionEyebrowStyle = {
  color: '#6f7d45',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 1.4,
  margin: 0
};

const sectionTitleStyle = {
  color: '#102a43',
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 32,
  lineHeight: 1.15,
  margin: 0
};

const sectionDescriptionStyle = {
  color: '#4b5563',
  lineHeight: 1.75,
  margin: 0
};
