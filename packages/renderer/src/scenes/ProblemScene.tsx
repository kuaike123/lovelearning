import React from 'react';

export const ProblemScene: React.FC<{subtitle?: string}> = ({subtitle = '\u9898\u76ee\u5c55\u793a'}) => {
  return <div>{subtitle}</div>;
};
