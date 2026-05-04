import React from 'react';

import {designTokens} from '../styles/tokens';
import {Button} from './Button';

type ErrorMessageProps = {
  message: string;
  onRetry?: () => void;
  suggestion?: string;
};

export function ErrorMessage({message, onRetry, suggestion}: ErrorMessageProps) {
  return (
    <section role="alert" style={containerStyle}>
      <strong style={titleStyle}>操作未完成</strong>
      <p style={bodyStyle}>{message}</p>
      {suggestion ? <p style={suggestionStyle}>{suggestion}</p> : null}
      {onRetry ? (
        <Button onClick={onRetry} type="button" variant="secondary">
          重试
        </Button>
      ) : null}
    </section>
  );
}

const containerStyle = {
  background: '#FEF2F2',
  border: `1px solid ${designTokens.colors.danger}`,
  borderRadius: designTokens.radii.md,
  color: designTokens.colors.danger,
  display: 'grid',
  gap: designTokens.spacing[2],
  padding: designTokens.spacing[4]
};

const titleStyle = {
  fontWeight: designTokens.typography.weightBold
};

const bodyStyle = {
  margin: 0
};

const suggestionStyle = {
  color: designTokens.colors.neutral700,
  margin: 0
};
