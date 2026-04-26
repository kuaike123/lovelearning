import React from 'react';

export const MistakeWarningScene: React.FC<{subtitle?: string}> = ({
  subtitle = '\u6613\u9519\u63d0\u9192'
}) => {
  return <div>{subtitle}</div>;
};
