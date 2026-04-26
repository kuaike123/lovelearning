import React from 'react';

type ShortVideoShellProps = {
  children?: React.ReactNode;
  sceneNumber: number;
  sceneType: string;
  title: string;
  totalScenes: number;
};

export const ShortVideoShell: React.FC<ShortVideoShellProps> = ({
  children,
  sceneNumber,
  sceneType,
  title,
  totalScenes
}) => {
  return (
    <div style={shellStyle(sceneType)}>
      <div style={orbStyle('10%', '8%', 180, '#F5C542')} />
      <div style={orbStyle('74%', '72%', 220, '#52B788')} />
      <main style={cardStyle}>
        <header style={headerStyle}>
          <div>
            <p style={eyebrowStyle}>{'\u77e5\u8bc6\u70b9\u901f\u8bb2'}</p>
            <h1 style={titleStyle}>{title}</h1>
          </div>
          <div style={counterStyle}>
            {sceneNumber}/{totalScenes}
          </div>
        </header>
        {children}
      </main>
      <div style={brandStyle}>{'EduMotion V1'}</div>
    </div>
  );
};

const shellStyle = (sceneType: string) => ({
  background:
    sceneType === 'title'
      ? 'radial-gradient(circle at 18% 12%, rgba(245,197,66,0.55), transparent 28%), linear-gradient(155deg, #102A43 0%, #1F5134 54%, #F1EAD9 100%)'
      : 'radial-gradient(circle at 14% 10%, rgba(245,197,66,0.34), transparent 26%), linear-gradient(160deg, #F7F3EA 0%, #E7F0DA 52%, #D6E7F7 100%)',
  color: '#1F2937',
  height: '100%',
  overflow: 'hidden',
  padding: 74,
  position: 'relative' as const,
  width: '100%'
});

const cardStyle = {
  background: 'rgba(255, 250, 241, 0.94)',
  border: '3px solid rgba(255,255,255,0.72)',
  borderRadius: 46,
  boxShadow: '0 34px 100px rgba(16, 42, 67, 0.22)',
  minHeight: '100%',
  padding: 54,
  position: 'relative' as const,
  zIndex: 2
};

const headerStyle = {
  alignItems: 'flex-start',
  display: 'flex',
  gap: 24,
  justifyContent: 'space-between',
  marginBottom: 32
};

const eyebrowStyle = {
  color: '#1F5134',
  fontSize: 26,
  fontWeight: 900,
  letterSpacing: 4,
  margin: 0
};

const titleStyle = {
  color: '#102A43',
  fontFamily: '"Noto Serif SC", "Microsoft YaHei", serif',
  fontSize: 54,
  fontWeight: 900,
  lineHeight: 1.08,
  margin: '10px 0 0'
};

const counterStyle = {
  background: '#102A43',
  borderRadius: 999,
  color: '#FFF7D6',
  fontSize: 26,
  fontWeight: 900,
  padding: '12px 20px'
};

const brandStyle = {
  bottom: 34,
  color: 'rgba(16, 42, 67, 0.55)',
  fontSize: 22,
  fontWeight: 900,
  letterSpacing: 2,
  position: 'absolute' as const,
  right: 54,
  zIndex: 3
};

const orbStyle = (left: string, top: string, size: number, color: string) => ({
  background: color,
  borderRadius: '50%',
  filter: 'blur(10px)',
  height: size,
  left,
  opacity: 0.22,
  position: 'absolute' as const,
  top,
  width: size,
  zIndex: 1
});
