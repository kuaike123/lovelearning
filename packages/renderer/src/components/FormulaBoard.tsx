import React from 'react';

type FormulaBoardProps = {
  formulas: string[];
  highlights?: string[];
  sceneType: string;
};

export const FormulaBoard: React.FC<FormulaBoardProps> = ({formulas, highlights, sceneType}) => {
  const safeFormulas = formulas.length > 0 ? formulas : [''];
  const activeHighlights = highlights ?? [];

  return (
    <section style={boardStyle} aria-label={'\u516c\u5f0f\u677f\u4e66'}>
      <div style={boardHeaderStyle}>
        <span>{'\u516c\u5f0f\u677f\u4e66'}</span>
        {sceneType === 'summary' ? <strong>{'\u6700\u7ec8\u7b54\u6848'}</strong> : null}
      </div>
      <div style={formulaListStyle}>
        {safeFormulas.map((formula, index) => (
          <div key={`${formula}-${index}`} style={formulaCardStyle(index, sceneType, activeHighlights.includes(formula))}>
            <span style={stepBadgeStyle}>{String(index + 1).padStart(2, '0')}</span>
            <div style={formulaContentStyle}>
              {activeHighlights.includes(formula) ? <strong style={highlightLabelStyle}>{'\u5173\u952e\u5f0f'}</strong> : null}
              <span style={formulaTextStyle(formula)}>{formula}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const boardStyle = {
  background: 'linear-gradient(135deg, #102A43 0%, #193B58 100%)',
  border: '3px solid rgba(255, 247, 214, 0.22)',
  borderRadius: 34,
  boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.06), 0 24px 70px rgba(16, 42, 67, 0.28)',
  color: '#fff7d6',
  padding: 28
};

const boardHeaderStyle = {
  alignItems: 'center',
  color: '#F5C542',
  display: 'flex',
  fontSize: 24,
  fontWeight: 800,
  gap: 14,
  justifyContent: 'space-between',
  letterSpacing: 2,
  marginBottom: 18
};

const formulaListStyle = {
  display: 'grid',
  gap: 14
};

const formulaCardStyle = (index: number, sceneType: string, isHighlighted: boolean) => ({
  alignItems: 'center',
  background:
    sceneType === 'summary' && index === 0
      ? 'linear-gradient(90deg, rgba(245,197,66,0.22), rgba(255,255,255,0.08))'
      : isHighlighted
        ? 'linear-gradient(90deg, rgba(82,183,136,0.28), rgba(255,255,255,0.08))'
      : 'rgba(255, 255, 255, 0.08)',
  border:
    index === 0
      ? '2px solid rgba(245, 197, 66, 0.72)'
      : isHighlighted
        ? '2px solid rgba(82, 183, 136, 0.72)'
        : '2px solid rgba(255, 255, 255, 0.12)',
  borderRadius: 24,
  display: 'grid',
  gap: 16,
  gridTemplateColumns: '68px minmax(0, 1fr)',
  padding: '18px 22px'
});

const stepBadgeStyle = {
  alignItems: 'center',
  background: '#F5C542',
  borderRadius: 18,
  color: '#102A43',
  display: 'inline-flex',
  fontSize: 24,
  fontWeight: 900,
  height: 52,
  justifyContent: 'center',
  width: 52
};

const formulaContentStyle = {
  display: 'grid',
  gap: 8
};

const highlightLabelStyle = {
  color: '#86EFAC',
  fontSize: 20,
  fontWeight: 900,
  letterSpacing: 2
};

const formulaTextStyle = (formula: string) => ({
  color: '#FFF7D6',
  fontFamily: '"JetBrains Mono", "Cascadia Mono", "Noto Sans SC", monospace',
  fontSize: formula.length > 24 ? 42 : 58,
  fontWeight: 900,
  letterSpacing: 0.3,
  lineHeight: 1.14,
  textShadow: '0 3px 0 rgba(0,0,0,0.18)',
  wordBreak: 'break-word' as const
});
