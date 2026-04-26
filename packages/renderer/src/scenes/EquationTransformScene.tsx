import React from 'react';

export const EquationTransformScene: React.FC<{subtitle?: string}> = ({
  subtitle = '\u7b49\u5f0f\u53d8\u5f62'
}) => {
  return <div>{subtitle}</div>;
};
