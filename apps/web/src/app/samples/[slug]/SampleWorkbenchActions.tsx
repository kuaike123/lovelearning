'use client';

import React, {useState} from 'react';

import {createSketchButtonStyle, createSketchEyebrowStyle, sketchColors} from '../../ui-primitives';

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
        <p style={eyebrowStyle}>{'WORKBENCH / \u5957\u7528\u751f\u6210'}</p>
        <p style={legacyEyebrowStyle}>{'\u6837\u7247\u5de5\u4f5c\u53f0'}</p>
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
  background: sketchColors.ink,
  border: `3px solid ${sketchColors.ink}`,
  borderRadius: 16,
  boxShadow: `6px 6px 0 ${sketchColors.accent}`,
  color: sketchColors.paper,
  display: 'grid',
  gap: 16,
  padding: 18
};

const eyebrowStyle = {
  ...createSketchEyebrowStyle(),
  color: sketchColors.warm,
  margin: '0 0 6px'
};

const legacyEyebrowStyle = {
  color: 'rgba(255, 248, 223, 0.78)',
  fontSize: 13,
  fontWeight: 700,
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
  ...createSketchButtonStyle({tone: 'primary'}),
  border: `2px solid ${sketchColors.paper}`,
  padding: '11px 14px',
};

const secondaryActionStyle = {
  ...createSketchButtonStyle({tone: 'secondary'}),
  background: sketchColors.paper,
  border: `2px solid ${sketchColors.paper}`,
  padding: '11px 14px',
};

const secondaryButtonStyle = {
  ...secondaryActionStyle,
  cursor: 'pointer',
  font: 'inherit'
};
