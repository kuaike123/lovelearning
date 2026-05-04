export type TextSize = 'large' | 'normal';

type AccessibilityIssue =
  | 'button-missing-accessible-name'
  | 'input-missing-label'
  | 'interactive-missing-focus-style';

export const contrastRatio = (foreground: string, background: string) => {
  const foregroundLuminance = relativeLuminance(hexToRgb(foreground));
  const backgroundLuminance = relativeLuminance(hexToRgb(background));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

export const meetsWcagAaContrast = (
  foreground: string,
  background: string,
  textSize: TextSize = 'normal'
) => {
  return contrastRatio(foreground, background) >= (textSize === 'large' ? 3 : 4.5);
};

export const auditStaticAccessibility = (markup: string): AccessibilityIssue[] => {
  const issues = new Set<AccessibilityIssue>();
  const buttonMatches = markup.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) ?? [];
  const inputMatches = markup.match(/<input\b[^>]*>/g) ?? [];

  for (const button of buttonMatches) {
    const visibleText = button.replace(/<[^>]+>/g, '').trim();

    if (!visibleText && !hasAttribute(button, 'aria-label') && !hasAttribute(button, 'aria-labelledby')) {
      issues.add('button-missing-accessible-name');
    }
  }

  for (const input of inputMatches) {
    const id = readAttribute(input, 'id');
    const hasLabel = Boolean(id && markup.includes(`for="${id}"`));

    if (!hasLabel && !hasAttribute(input, 'aria-label') && !hasAttribute(input, 'aria-labelledby')) {
      issues.add('input-missing-label');
    }
  }

  if (!markup.includes(':focus-visible') && !markup.includes('outline:2px')) {
    issues.add('interactive-missing-focus-style');
  }

  return [...issues];
};

const hasAttribute = (markup: string, attribute: string) => markup.includes(`${attribute}=`);

const readAttribute = (markup: string, attribute: string) => {
  const match = markup.match(new RegExp(`${attribute}="([^"]+)"`));

  return match?.[1];
};

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;

  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16)
  ];
};

const relativeLuminance = ([red, green, blue]: [number, number, number]) => {
  const [r, g, b] = [red, green, blue].map((channel) => {
    const normalized = channel / 255;

    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
