import React from 'react';

export const MistakeWarningScene: React.FC<{subtitle?: string}> = ({
  subtitle = '易错提醒'
}) => {
  return <div>{subtitle}</div>;
};
