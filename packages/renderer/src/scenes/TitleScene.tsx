import React from 'react';

export const TitleScene: React.FC<{title?: string}> = ({title = '课程标题'}) => {
  return <div>{title}</div>;
};
