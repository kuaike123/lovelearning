import React from 'react';

import type {SceneVisuals} from '../lib/scene-visuals';

import {FormulaBoard} from './FormulaBoard';

type SceneLayoutRendererProps = {
  sceneType: string;
  visuals: SceneVisuals;
};

export const SceneLayoutRenderer: React.FC<SceneLayoutRendererProps> = ({sceneType, visuals}) => {
  if (visuals.layout === 'title_card') {
    if (visuals.coverLayout === 'quantity_story') {
      return (
        <section style={heroStyle}>
          <div style={heroEyebrowStyle}>{visuals.eyebrow ?? '\u5df2\u77e5\u6761\u4ef6\u62c6\u5f00\u8bb2'}</div>
          <h1 style={heroTitleStyle}>{visuals.heading}</h1>
          {visuals.detail ? (
            <div style={goalCardStyle}>
              <strong>{'\u5b66\u4e60\u76ee\u6807'}</strong>
              <span>{visuals.detail}</span>
            </div>
          ) : null}
          <div style={coverStoryGridStyle}>
            <section style={coverStoryCardStyle}>
              <strong>{'\u5df2\u77e5\u6761\u4ef6'}</strong>
              <div style={chipRowStyle}>
                {visuals.formulas.slice(0, 1).map((item, index) => (
                  <span key={`${item}-${index}`} style={highlightChipStyle}>
                    {item}
                  </span>
                ))}
              </div>
            </section>
            <section style={coverStoryCardStyle}>
              <strong>{'\u5173\u7cfb\u7ebf\u7d22'}</strong>
              <div style={chipRowStyle}>
                {visuals.formulas.slice(1).map((item, index) => (
                  <span key={`${item}-${index}`} style={highlightChipStyle}>
                    {item}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </section>
      );
    }

    return (
      <section style={heroStyle}>
        <div style={heroEyebrowStyle}>{visuals.eyebrow ?? '\u77e5\u8bc6\u70b9\u5feb\u901f\u5165\u95e8'}</div>
        <h1 style={heroTitleStyle}>{visuals.heading}</h1>
        <div style={hookCardStyle}>
          <strong>{'\u4eca\u65e5\u8bb2\u5e08\u63d0\u8981'}</strong>
          <span>
            {visuals.coverHook ??
              `\u8001\u5e08\u53e3\u64ad\u5356\u70b9\uff1a${
                visuals.detail ?? '\u5148\u6293\u4f4f\u9898\u76ee\u91cc\u6700\u5173\u952e\u7684\u4e00\u6b65'
              }`}
          </span>
        </div>
        {visuals.detail ? (
          <div style={goalCardStyle}>
            <strong>{'\u5b66\u4e60\u76ee\u6807'}</strong>
            <span>{visuals.detail}</span>
          </div>
        ) : null}
        <FormulaBoard formulas={visuals.formulas.slice(0, 1)} highlights={visuals.highlights} sceneType={sceneType} />
      </section>
    );
  }

  if (visuals.layout === 'problem_card') {
    return (
      <section style={stackStyle}>
        <section style={problemCardStyle}>
          <strong>{'\u9898\u76ee\u62c6\u89e3'}</strong>
          <h2 style={sectionTitleStyle}>{visuals.heading}</h2>
          {visuals.detail ? <p style={detailTextStyle}>{visuals.detail}</p> : null}
        </section>
        {visuals.highlights?.length ? (
          <section style={keywordCardStyle}>
            <strong>{'\u672c\u9898\u5173\u952e\u8bcd'}</strong>
            <div style={chipRowStyle}>
              {visuals.highlights.map((item, index) => (
                <span key={`${item}-${index}`} style={highlightChipStyle}>
                  {item}
                </span>
              ))}
            </div>
          </section>
        ) : null}
        <div style={helperBannerStyle}>
          <strong>{'\u8001\u5e08\u63d0\u793a'}</strong>
          <span>{'\u5148\u5708\u51fa\u5df2\u77e5\u6761\u4ef6\uff0c\u518d\u51b3\u5b9a\u8981\u8bbe\u54ea\u4e2a\u91cf\u4e3a\u672a\u77e5\u6570\u3002'}</span>
        </div>
        <FormulaBoard formulas={visuals.formulas} highlights={visuals.highlights} sceneType={sceneType} />
      </section>
    );
  }

  if (visuals.layout === 'summary') {
    return (
      <section style={stackStyle}>
        <div style={answerHeroStyle}>
          <strong>{'\u6700\u7ec8\u7b54\u6848'}</strong>
          <div style={answerTextStyle}>{visuals.answer ?? visuals.formulas[0] ?? visuals.heading}</div>
        </div>
        {visuals.detail ? (
          <div style={summaryNoteStyle}>
            <strong>{'\u89e3\u9898\u5957\u8def'}</strong>
            <span>{visuals.detail}</span>
          </div>
        ) : null}
        <div style={takeawayCardStyle}>
          <strong>{'\u5e26\u8d70\u4e00\u53e5'}</strong>
          <span>
            {visuals.takeaway ??
              (visuals.answer
                ? `\u5148\u5217\u51fa\u5173\u952e\u5173\u7cfb\uff0c\u518d\u628a\u7b54\u6848\u5199\u6210 ${visuals.answer}\u3002`
                : '\u5148\u627e\u5173\u952e\u6761\u4ef6\uff0c\u518d\u6309\u6b65\u9aa4\u5199\u51fa\u7ed3\u8bba\u3002')}
          </span>
        </div>
        <div style={nextStepCardStyle}>
          <strong>{'\u4e3e\u4e00\u53cd\u4e09'}</strong>
          <span>
            {visuals.nextStep ??
              '\u540c\u7c7b\u9898\u4e5f\u80fd\u4e00\u952e\u751f\u6210\u8bb2\u89e3\uff0c\u4e0b\u6b21\u5148\u627e\u5173\u952e\u5173\u7cfb\u518d\u5217\u5f0f\u3002'}
          </span>
        </div>
        <FormulaBoard formulas={visuals.formulas} highlights={visuals.highlights} sceneType={sceneType} />
      </section>
    );
  }

  if (visuals.layout === 'comparison') {
    return (
      <section style={stackStyle}>
        <div style={comparisonCardStyle}>
          <strong>{'\u5bf9\u6bd4\u89c2\u5bdf'}</strong>
          <h2 style={sectionTitleStyle}>{visuals.heading}</h2>
          {visuals.detail ? <p style={detailTextStyle}>{visuals.detail}</p> : null}
        </div>
        {visuals.mistake ? (
          <div style={comparisonGridStyle}>
            <section style={wrongCardStyle}>
              <strong>{'\u5e38\u89c1\u9519\u6cd5'}</strong>
              <p style={detailTextStyle}>{visuals.mistake.wrong}</p>
            </section>
            <section style={correctCardStyle}>
              <strong>{'\u6b63\u786e\u505a\u6cd5'}</strong>
              <p style={detailTextStyle}>{visuals.mistake.correct}</p>
            </section>
          </div>
        ) : null}
        {visuals.mistake?.tip ? (
          <div style={teacherTipStyle}>
            <strong>{'\u8001\u5e08\u63d0\u9192'}</strong>
            <span>{visuals.mistake.tip}</span>
          </div>
        ) : null}
        <div style={warningBannerStyle}>
          <strong>{'\u5f97\u5206\u89c2\u5bdf'}</strong>
          <span>{'\u8fd9\u4e00\u6b65\u6700\u5bb9\u6613\u5931\u5206\uff0c\u4e00\u5b9a\u8981\u5148\u68c0\u67e5\u662f\u5426\u4fdd\u6301\u4e24\u8fb9\u540c\u6b65\u53d8\u5316\u3002'}</span>
        </div>
        <FormulaBoard formulas={visuals.formulas} highlights={visuals.highlights} sceneType={sceneType} />
      </section>
    );
  }

  return (
    <section style={stackStyle}>
      <FormulaBoard formulas={visuals.formulas} highlights={visuals.highlights} sceneType={sceneType} />
      {visuals.detail ? (
        <div style={summaryNoteStyle}>
          <strong>{'\u753b\u9762\u91cd\u70b9'}</strong>
          <span>{visuals.detail}</span>
        </div>
      ) : null}
    </section>
  );
};

const stackStyle = {
  display: 'grid',
  gap: 24
};

const heroStyle = {
  display: 'grid',
  gap: 22
};

const heroEyebrowStyle = {
  color: '#C2410C',
  fontSize: 24,
  fontWeight: 900,
  letterSpacing: 4
};

const heroTitleStyle = {
  color: '#102A43',
  fontSize: 64,
  fontWeight: 900,
  lineHeight: 1.08,
  margin: 0
};

const goalCardStyle = {
  background: 'linear-gradient(135deg, rgba(255,247,214,0.95), rgba(255,255,255,0.92))',
  border: '2px solid rgba(245, 197, 66, 0.55)',
  borderRadius: 26,
  color: '#1F2937',
  display: 'grid',
  fontSize: 28,
  gap: 10,
  lineHeight: 1.45,
  padding: 24
};

const hookCardStyle = {
  background: 'linear-gradient(135deg, rgba(16,42,67,0.96), rgba(31,81,52,0.9))',
  border: '2px solid rgba(255, 244, 204, 0.18)',
  borderRadius: 26,
  color: '#FFF7D6',
  display: 'grid',
  fontSize: 26,
  gap: 10,
  lineHeight: 1.5,
  padding: 24
};

const problemCardStyle = {
  background: '#FFFFFF',
  border: '2px solid rgba(16, 42, 67, 0.1)',
  borderRadius: 28,
  color: '#102A43',
  display: 'grid',
  gap: 14,
  padding: 28
};

const comparisonCardStyle = {
  background: 'linear-gradient(135deg, rgba(194,65,12,0.08), rgba(255,255,255,0.96))',
  border: '2px solid rgba(194, 65, 12, 0.18)',
  borderRadius: 28,
  color: '#7C2D12',
  display: 'grid',
  gap: 14,
  padding: 28
};

const comparisonGridStyle = {
  display: 'grid',
  gap: 18,
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
};

const wrongCardStyle = {
  background: 'linear-gradient(135deg, rgba(254,226,226,0.96), rgba(255,255,255,0.98))',
  border: '2px solid rgba(220, 38, 38, 0.18)',
  borderRadius: 24,
  color: '#991B1B',
  display: 'grid',
  gap: 10,
  padding: 22
};

const correctCardStyle = {
  background: 'linear-gradient(135deg, rgba(220,252,231,0.96), rgba(255,255,255,0.98))',
  border: '2px solid rgba(22, 163, 74, 0.18)',
  borderRadius: 24,
  color: '#166534',
  display: 'grid',
  gap: 10,
  padding: 22
};

const sectionTitleStyle = {
  fontSize: 42,
  fontWeight: 900,
  lineHeight: 1.18,
  margin: 0
};

const detailTextStyle = {
  fontSize: 28,
  lineHeight: 1.5,
  margin: 0
};

const chipRowStyle = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  gap: 12
};

const coverStoryGridStyle = {
  display: 'grid',
  gap: 18,
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
};

const coverStoryCardStyle = {
  background: 'linear-gradient(135deg, rgba(220,252,231,0.92), rgba(255,255,255,0.98))',
  border: '2px solid rgba(34, 197, 94, 0.18)',
  borderRadius: 24,
  color: '#14532D',
  display: 'grid',
  gap: 14,
  padding: 22
};

const keywordCardStyle = {
  background: 'linear-gradient(135deg, rgba(220,252,231,0.92), rgba(255,255,255,0.98))',
  border: '2px solid rgba(34, 197, 94, 0.18)',
  borderRadius: 24,
  color: '#14532D',
  display: 'grid',
  gap: 14,
  padding: 22
};

const helperBannerStyle = {
  background: 'linear-gradient(135deg, rgba(16,42,67,0.96), rgba(29,78,216,0.9))',
  border: '2px solid rgba(255, 244, 204, 0.18)',
  borderRadius: 24,
  color: '#FFF7D6',
  display: 'grid',
  fontSize: 26,
  gap: 10,
  lineHeight: 1.45,
  padding: 22
};

const highlightChipStyle = {
  background: '#DCFCE7',
  border: '2px solid rgba(34, 197, 94, 0.22)',
  borderRadius: 999,
  color: '#166534',
  fontSize: 24,
  fontWeight: 800,
  padding: '12px 18px'
};

const answerHeroStyle = {
  background: 'linear-gradient(135deg, #102A43 0%, #1D4ED8 100%)',
  borderRadius: 32,
  color: '#FFF7D6',
  display: 'grid',
  gap: 12,
  padding: 30
};

const answerTextStyle = {
  color: '#FFFFFF',
  fontFamily: '"JetBrains Mono", "Cascadia Mono", "Noto Sans SC", monospace',
  fontSize: 66,
  fontWeight: 900,
  lineHeight: 1.08
};

const summaryNoteStyle = {
  background: '#FFF7D6',
  border: '2px solid rgba(245, 197, 66, 0.55)',
  borderRadius: 24,
  color: '#374151',
  display: 'grid',
  fontSize: 28,
  gap: 10,
  lineHeight: 1.45,
  padding: 24
};

const takeawayCardStyle = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(219,234,254,0.95))',
  border: '2px solid rgba(29, 78, 216, 0.14)',
  borderRadius: 24,
  color: '#1E3A8A',
  display: 'grid',
  fontSize: 28,
  gap: 10,
  lineHeight: 1.45,
  padding: 24
};

const nextStepCardStyle = {
  background: 'linear-gradient(135deg, rgba(220,252,231,0.98), rgba(255,255,255,0.96))',
  border: '2px solid rgba(34, 197, 94, 0.18)',
  borderRadius: 24,
  color: '#166534',
  display: 'grid',
  fontSize: 28,
  gap: 10,
  lineHeight: 1.45,
  padding: 24
};

const teacherTipStyle = {
  background: 'linear-gradient(135deg, rgba(255,247,214,0.98), rgba(255,255,255,0.98))',
  border: '2px solid rgba(245, 158, 11, 0.22)',
  borderRadius: 24,
  color: '#92400E',
  display: 'grid',
  fontSize: 28,
  gap: 10,
  lineHeight: 1.45,
  padding: 24
};

const warningBannerStyle = {
  background: 'linear-gradient(135deg, rgba(127,29,29,0.92), rgba(194,65,12,0.88))',
  border: '2px solid rgba(254, 226, 226, 0.18)',
  borderRadius: 24,
  color: '#FEF2F2',
  display: 'grid',
  fontSize: 28,
  gap: 10,
  lineHeight: 1.45,
  padding: 24
};
