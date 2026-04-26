import React from 'react';

export const SummaryScene: React.FC<{subtitle?: string}> = ({subtitle = '\u8bfe\u5802\u603b\u7ed3'}) => {
  return <div>{subtitle}</div>;
};
