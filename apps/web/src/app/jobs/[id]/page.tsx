import React from 'react';

import {
  appShellStyle,
  contentShellStyle,
  createSketchCardStyle,
  createSketchEyebrowStyle,
  sketchColors
} from '../../ui-primitives';
import {designTokens} from '../../ui-primitives-v2';
import {JobResultPanel} from './JobResultPanel';

type JobResultPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobResultPage({params}: JobResultPageProps) {
  const {id} = await params;

  return (
    <main data-job-typography="product-editorial" data-sketch-job-page="delivery-center" style={appShellStyle}>
      <div style={contentShellStyle}>
        <header style={resultHeaderStyle}>
          <p style={resultEyebrowStyle}>{'DELIVERY BOARD / \u751f\u6210\u4ea4\u4ed8'}</p>
          <p style={resultSubEyebrowStyle}>{'\u89c6\u9891\u4ea4\u4ed8\u4e2d\u5fc3'}</p>
          <h1 style={resultTitleStyle}>{'\u751f\u6210\u7ed3\u679c'}</h1>
          <p style={resultDescriptionStyle}>
            {'\u6309\u751f\u6210\u8fdb\u5ea6\u3001\u89c6\u9891\u9884\u89c8\u548c\u4ea4\u4ed8\u7d20\u6750\u7ec4\u7ec7\uff0c\u8ba9\u8001\u5e08\u6216\u8fd0\u8425\u540c\u5b66\u80fd\u5feb\u901f\u5224\u65ad\u8fd9\u6761\u8bb2\u89e3\u89c6\u9891\u662f\u5426\u53ef\u4ee5\u76f4\u63a5\u4f7f\u7528\u3002'}
          </p>
        </header>
      <JobResultPanel jobId={id} />
      </div>
    </main>
  );
}

const resultHeaderStyle = {
  ...createSketchCardStyle({tone: 'paper'}),
  background:
    'linear-gradient(rgba(42,36,29,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(42,36,29,0.07) 1px, transparent 1px), #fff8df',
  backgroundSize: '22px 22px',
  gap: 8,
  padding: '24px 26px'
};

const resultEyebrowStyle = createSketchEyebrowStyle();

const resultSubEyebrowStyle = {
  color: designTokens.colors.neutral[500],
  fontSize: 13,
  fontWeight: 800,
  margin: 0
};

const resultTitleStyle = {
  color: sketchColors.ink,
  fontFamily:
    '"Avenir Next", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  fontSize: 40,
  fontWeight: designTokens.fontWeight.extrabold,
  letterSpacing: '-0.03em',
  lineHeight: 1.12,
  margin: 0
};

const resultDescriptionStyle = {
  color: designTokens.colors.neutral[600],
  lineHeight: designTokens.lineHeight.relaxed,
  margin: 0,
  maxWidth: 820
};
