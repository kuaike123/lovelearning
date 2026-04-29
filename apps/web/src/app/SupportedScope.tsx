import React from 'react';

import {getProblemTemplates} from '../../../../packages/lesson-engine/src/problem-templates';

const supportedTemplates = getProblemTemplates();
const exampleProblems = supportedTemplates.flatMap((template) => template.examples);

export function SupportedScope() {
  return (
    <section style={scopeStyle}>
      <p style={scopeEyebrowStyle}>{'\u5f53\u524d V1 \u652f\u6301'}</p>
      <h2 style={scopeTitleStyle}>{supportedTemplates.map((template) => template.label).join(' 路 ')}</h2>
      <div style={templateGridStyle}>
        {supportedTemplates.map((template) => (
          <article key={template.id} style={templateCardStyle}>
            <h3 style={templateLabelStyle}>{template.label}</h3>
            <p style={scopeTextStyle}>{template.description}</p>
          </article>
        ))}
      </div>
      <div style={exampleGridStyle} aria-label={'\u4e00\u952e\u586b\u5165\u793a\u4f8b'}>
        {exampleProblems.map((problem) => (
          <a key={problem} href={`/?content=${encodeURIComponent(problem)}`} style={exampleLinkStyle}>
            {'\u4e00\u952e\u586b\u5165\u793a\u4f8b'}
            <span style={exampleProblemStyle}>{problem}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

const scopeStyle = {
  background: '#f1ead9',
  border: '1px solid #d7c8a9',
  borderRadius: 24,
  margin: '18px 0 24px',
  padding: 24
};

const scopeEyebrowStyle = {
  color: '#6f7d45',
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: 1.4,
  margin: 0
};

const scopeTitleStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 30,
  lineHeight: 1.15,
  margin: '8px 0'
};

const scopeTextStyle = {
  color: '#374151',
  lineHeight: 1.7,
  margin: 0
};

const templateGridStyle = {
  display: 'grid',
  gap: 12,
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  margin: '0 0 18px'
};

const templateCardStyle = {
  background: '#fffaf1',
  border: '1px solid #eadfca',
  borderRadius: 16,
  padding: 14
};

const templateLabelStyle = {
  fontSize: 17,
  margin: '0 0 8px'
};

const exampleGridStyle = {
  display: 'grid',
  gap: 10,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
};

const exampleLinkStyle = {
  background: '#fffaf1',
  border: '1px solid #eadfca',
  borderRadius: 16,
  color: '#1f2937',
  display: 'grid',
  gap: 6,
  padding: 14,
  textDecoration: 'none'
};

const exampleProblemStyle = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  fontSize: 15,
  fontWeight: 700
};
