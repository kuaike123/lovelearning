import React from 'react';

export const SummaryScene: React.FC<{subtitle?: string}> = ({subtitle = '课堂总结'}) => {
  return <div>{subtitle}</div>;
};
