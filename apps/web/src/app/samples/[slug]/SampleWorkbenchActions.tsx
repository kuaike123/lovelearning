'use client';

import React, {useState} from 'react';

type SampleWorkbenchActionsProps = {
  generationHref: string;
  problemText: string;
};

export function SampleWorkbenchActions({generationHref, problemText}: SampleWorkbenchActionsProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(problemText);
      setCopyState('copied');
    } catch {
      setCopyState('idle');
    }
  };

  return (
    <section style={workbenchStyle}>
      <div>
        <p style={eyebrowStyle}>{'\u6837\u7247\u5de5\u4f5c\u53f0'}</p>
        <h2 style={titleStyle}>{'\u628a\u8fd9\u5957\u6837\u7247\u53d8\u6210\u4f60\u7684\u8bb2\u89e3\u89c6\u9891'}</h2>
      </div>
      <div style={actionGridStyle}>
        <button type="button" onClick={() => void handleCopy()} style={secondaryButtonStyle}>
          {copyState === 'copied' ? '\u5df2\u590d\u5236' : '\u590d\u5236\u9898\u76ee'}
        </button>
        <a href={generationHref} style={primaryActionStyle}>
          {'\u4e00\u952e\u751f\u6210\u540c\u6b3e'}
        </a>
        <a href="/#featured-samples" style={secondaryActionStyle}>
          {'\u8fd4\u56de\u6837\u7247\u5e93'}
        </a>
      </div>
    </section>
  );
}

const workbenchStyle = {
  background: '#102A43',
  borderRadius: 18,
  color: '#FFF7D6',
  display: 'grid',
  gap: 16,
  padding: 18
};

const eyebrowStyle = {
  color: '#F5C542',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 1.2,
  margin: '0 0 6px'
};

const titleStyle = {
  fontSize: 20,
  lineHeight: 1.35,
  margin: 0
};

const actionGridStyle = {
  display: 'grid',
  gap: 10,
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))'
};

const primaryActionStyle = {
  background: '#FFF4CC',
  borderRadius: 999,
  color: '#7C4A03',
  display: 'inline-flex',
  fontWeight: 800,
  justifyContent: 'center',
  padding: '11px 14px',
  textDecoration: 'none'
};

const secondaryActionStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 999,
  color: '#FFF7D6',
  display: 'inline-flex',
  fontWeight: 800,
  justifyContent: 'center',
  padding: '11px 14px',
  textDecoration: 'none'
};

const secondaryButtonStyle = {
  ...secondaryActionStyle,
  cursor: 'pointer',
  font: 'inherit'
};
