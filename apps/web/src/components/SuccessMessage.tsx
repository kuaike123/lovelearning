import React from 'react';

import {designTokens} from '../styles/tokens';

type SuccessMessageProps = {
  message: string;
};

export function SuccessMessage({message}: SuccessMessageProps) {
  return (
    <section data-auto-dismiss-ms="4000" role="status" style={containerStyle}>
      {message}
    </section>
  );
}

const containerStyle = {
  background: '#ECFDF5',
  border: `1px solid ${designTokens.colors.success}`,
  borderRadius: designTokens.radii.md,
  color: designTokens.colors.success,
  fontWeight: designTokens.typography.weightBold,
  padding: designTokens.spacing[4]
};
