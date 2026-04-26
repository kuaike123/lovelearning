import React from 'react';

export const ProblemScene: React.FC<{subtitle?: string}> = ({subtitle = '题目展示'}) => {
  return <div>{subtitle}</div>;
};
