import React from 'react';

import {appShellStyle, contentShellStyle} from '../../ui-primitives';
import {JobResultPanel} from './JobResultPanel';

type JobResultPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function JobResultPage({params}: JobResultPageProps) {
  const {id} = await params;

  return (
    <main style={appShellStyle}>
      <div style={contentShellStyle}>
        <header style={resultHeaderStyle}>
          <p style={resultEyebrowStyle}>{'\u89c6\u9891\u4ea4\u4ed8\u4e2d\u5fc3'}</p>
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
  background:
    'radial-gradient(circle at 88% 4%, rgba(255, 36, 66, 0.1), transparent 24%), linear-gradient(135deg, #fffaf1 0%, #ffffff 100%)',
  border: '1px solid #eadfca',
  borderRadius: 28,
  boxShadow: '0 18px 50px rgba(16, 42, 67, 0.07)',
  display: 'grid',
  gap: 8,
  padding: '24px 26px'
};

const resultEyebrowStyle = {
  color: '#c0512f',
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: 1.4,
  margin: 0
};

const resultTitleStyle = {
  color: '#1c1a17',
  fontFamily: '"Times New Roman", Georgia, "Noto Serif SC", serif',
  fontSize: 42,
  lineHeight: 1.1,
  margin: 0
};

const resultDescriptionStyle = {
  color: '#4b5563',
  lineHeight: 1.75,
  margin: 0,
  maxWidth: 820
};
