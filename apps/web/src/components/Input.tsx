import React from 'react';

import {designTokens} from '../styles/tokens';

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'aria-invalid'> & {
  error?: string;
  helpText?: string;
  label: string;
};

export function Input({error, helpText, id, label, style, ...props}: InputProps) {
  const inputId = id ?? props.name ?? 'input-field';
  const helpId = helpText ? `${inputId}-help` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div style={{display: 'grid', gap: designTokens.spacing[2]}}>
      <label
        htmlFor={inputId}
        style={{
          color: designTokens.colors.neutral900,
          fontSize: designTokens.typography.sizeSm,
          fontWeight: designTokens.typography.weightBold
        }}
      >
        {label}
      </label>
      <input
        {...props}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        id={inputId}
        style={{
          background: designTokens.colors.surface,
          border: `1px solid ${error ? designTokens.colors.danger : designTokens.colors.border}`,
          borderRadius: designTokens.radii.md,
          color: designTokens.colors.neutral900,
          minHeight: '44px',
          padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
          width: '100%',
          ...style
        }}
      />
      {helpText ? (
        <p
          data-input-help="true"
          id={helpId}
          style={{
            color: designTokens.colors.neutral600,
            fontSize: designTokens.typography.sizeSm,
            lineHeight: designTokens.typography.lineNormal,
            margin: 0
          }}
        >
          {helpText}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          role="alert"
          style={{
            color: designTokens.colors.danger,
            fontSize: designTokens.typography.sizeSm,
            lineHeight: designTokens.typography.lineNormal,
            margin: 0
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
