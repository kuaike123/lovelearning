import React, {useMemo} from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export const MathText: React.FC<{
  text: string;
  inline?: boolean;
  style?: React.CSSProperties;
}> = ({text, inline = true, style}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(text, {
        throwOnError: false,
        displayMode: !inline,
        trust: true,
      });
    } catch (e) {
      console.warn('KaTeX rendering failed:', e);
      return text;
    }
  }, [text, inline]);

  return (
    <span
      className="math-text"
      style={{
        display: inline ? 'inline-block' : 'block',
        ...style,
      }}
      dangerouslySetInnerHTML={{__html: html}}
    />
  );
};
