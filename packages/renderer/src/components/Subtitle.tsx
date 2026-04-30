import React from 'react';

export const Subtitle: React.FC<{text: string}> = ({text}) => {
  return (
    <section style={subtitleShellStyle} aria-label={'字幕跟读'}>
      <div style={subtitleHeaderStyle}>
        <span style={subtitleKickerStyle}>{'讲师口播'}</span>
        <span style={subtitleMetaStyle}>{'字幕跟读'}</span>
      </div>
      <p style={subtitleTextStyle}>{text}</p>
    </section>
  );
};

const subtitleShellStyle = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,250,241,0.94))',
  border: '2px solid rgba(16, 42, 67, 0.1)',
  borderRadius: 28,
  boxShadow: '0 18px 40px rgba(16, 42, 67, 0.08)',
  display: 'grid',
  gap: 12,
  padding: 22
};

const subtitleHeaderStyle = {
  alignItems: 'center',
  display: 'flex',
  gap: 10,
  justifyContent: 'space-between'
};

const subtitleKickerStyle = {
  background: '#102A43',
  borderRadius: 999,
  color: '#FFF7D6',
  display: 'inline-flex',
  fontSize: 14,
  fontWeight: 800,
  padding: '6px 12px'
};

const subtitleMetaStyle = {
  color: '#6B7280',
  fontSize: 14,
  fontWeight: 700
};

const subtitleTextStyle = {
  color: '#1F2937',
  fontSize: 30,
  fontWeight: 700,
  lineHeight: 1.5,
  margin: 0
};
