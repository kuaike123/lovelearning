export type ActionHierarchy = 'primary' | 'secondary' | 'tertiary';
export type HeadingHierarchy = 'card' | 'page' | 'section';

export const spacingRatio = {
  related: 1,
  grouped: 1.5,
  separated: 2
} as const;

export const getActionHierarchy = (level: ActionHierarchy) => {
  if (level === 'primary') {
    return {prominence: 'highest', weight: 3} as const;
  }

  if (level === 'secondary') {
    return {prominence: 'medium', weight: 2} as const;
  }

  return {prominence: 'low', weight: 1} as const;
};

export const getHeadingHierarchy = (level: HeadingHierarchy) => {
  if (level === 'page') {
    return {tag: 'h1', weight: 3} as const;
  }

  if (level === 'section') {
    return {tag: 'h2', weight: 2} as const;
  }

  return {tag: 'h3', weight: 1} as const;
};
