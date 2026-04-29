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
          <div style={heroContentStyle}>
            <p style={heroEyebrowStyle}>{'\u4e2d\u5c0f\u5b66\u6559\u57f9\u89c6\u9891\u5de5\u5382'}</p>
            <h1 style={heroTitleStyle}>{'\u4ece\u9898\u76ee\u5230\u77ed\u89c6\u9891\uff0c\u4e00\u9875\u5b8c\u6210\u8bb2\u89e3\u751f\u6210'}</h1>
            <p style={heroDescriptionStyle}>
              {
                '\u628a\u9898\u76ee\u8f93\u5165\u3001\u914d\u97f3\u9009\u62e9\u3001\u751f\u6210\u8bb0\u5f55\u548c\u6837\u7247\u5165\u53e3\u653e\u5230\u540c\u4e00\u5957\u6e05\u6670\u5de5\u4f5c\u6d41\u91cc\uff0c\u8ba9\u9996\u6b21\u4f7f\u7528\u8005\u4e5f\u80fd\u5feb\u901f\u4ea7\u51fa\u6559\u57f9\u8bb2\u89e3\u89c6\u9891\u3002'
              }
            </p>
          </div>
          <div style={heroStatsGridStyle}>
            <article style={heroStatCardStyle}>
              <span style={heroStatLabelStyle}>{'\u5f53\u524d\u4e3b\u6253'}</span>
              <strong style={heroStatValueStyle}>{'\u521d\u4e2d\u6570\u5b66 V1'}</strong>
              <p style={heroStatBodyStyle}>{'\u65b9\u7a0b\u9898\u548c\u6570\u91cf\u5173\u7cfb\u5e94\u7528\u9898\u5df2\u7ecf\u8dd1\u901a\u3002'}</p>
            </article>
            <article style={heroStatCardStyle}>
              <span style={heroStatLabelStyle}>{'\u6807\u51c6\u4ea7\u7269'}</span>
              <strong style={heroStatValueStyle}>{'\u89c6\u9891 + \u914d\u97f3 + \u5b57\u5e55'}</strong>
              <p style={heroStatBodyStyle}>{'\u7ed3\u679c\u9875\u53ef\u76f4\u63a5\u67e5\u770b\u4ea4\u4ed8\u7269\uff0c\u65b9\u4fbf\u6559\u57f9\u573a\u666f\u6f14\u793a\u3002'}</p>
            </article>
            <article style={heroStatCardStyle}>
              <span style={heroStatLabelStyle}>{'\u4e0a\u624b\u65b9\u5f0f'}</span>
              <strong style={heroStatValueStyle}>{'\u6837\u7247\u5957\u7528\u6216\u76f4\u63a5\u63d0\u4ea4'}</strong>
              <p style={heroStatBodyStyle}>{'\u53ef\u4ee5\u5148\u5957\u7528\u6837\u7247\uff0c\u4e5f\u53ef\u4ee5\u76f4\u63a5\u4ece\u9898\u76ee\u5f00\u59cb\u751f\u6210\u3002'}</p>
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
          <p style={sectionEyebrowStyle}>{'\u5de5\u4f5c\u533a\u5207\u6362'}</p>
          <h2 style={sectionTitleStyle}>{'\u5148\u9009\u64cd\u4f5c\u5165\u53e3\uff0c\u518d\u8fdb\u5165\u5bf9\u5e94\u754c\u9762'}</h2>
          <p style={sectionDescriptionStyle}>
            {'\u4e0d\u518d\u628a\u6240\u6709\u5185\u5bb9\u6324\u5728\u4e00\u5c4f\uff0c\u70b9\u51fb\u4e0b\u9762\u4e09\u4e2a\u5165\u53e3\u5373\u53ef\u5728\u540c\u4e00\u9875\u5185\u5b8c\u6210\u5207\u6362\u3002'}
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
  background: 'linear-gradient(135deg, #102a43 0%, #1b4332 58%, #6f7d45 100%)',
  borderRadius: 32,
  color: '#fff7d6',
  display: 'grid',
  gap: 22,
  overflow: 'hidden',
  padding: '32px 28px'
};

const heroContentStyle = {
  display: 'grid',
  gap: 12,
  maxWidth: 820
};

const heroEyebrowStyle = {
  color: '#f5c542',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 1.8,
  margin: 0
};

const heroTitleStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 44,
  lineHeight: 1.08,
  margin: 0
};

const heroDescriptionStyle = {
  color: 'rgba(255, 247, 214, 0.92)',
  fontSize: 17,
  lineHeight: 1.75,
  margin: 0,
  maxWidth: 760
};

const heroStatsGridStyle = {
  display: 'grid',
  gap: 14,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
};

const heroStatCardStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 22,
  display: 'grid',
  gap: 8,
  padding: 18
};

const heroStatLabelStyle = {
  color: '#f5c542',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1.2
};

const heroStatValueStyle = {
  fontSize: 20,
  lineHeight: 1.3
};

const heroStatBodyStyle = {
  color: 'rgba(255, 247, 214, 0.88)',
  lineHeight: 1.65,
  margin: 0
};

const heroActionRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 12
};

const primaryHeroActionStyle = {
  background: '#fff4cc',
  borderRadius: 999,
  color: '#7c4a03',
  display: 'inline-flex',
  fontWeight: 800,
  justifyContent: 'center',
  padding: '12px 18px',
  textDecoration: 'none'
};

const secondaryHeroActionStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 999,
  color: '#fff7d6',
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
