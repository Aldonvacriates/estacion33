export const shadows = {
  sm: '0 1px 2px 0 rgba(15,15,15,0.08)',
  md: '0 4px 8px 0 rgba(15,15,15,0.10)',
  lg: '0 12px 24px 0 rgba(15,15,15,0.14)',
} as const;

export type Shadows = typeof shadows;
