import React from 'react';

export const EquationTransformScene: React.FC<{subtitle?: string}> = ({
  subtitle = '等式变形'
}) => {
  return <div>{subtitle}</div>;
};
