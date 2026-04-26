import React from 'react';

export const TitleScene: React.FC<{title?: string}> = ({title = '\u8bfe\u7a0b\u6807\u9898'}) => {
  return <div>{title}</div>;
};
