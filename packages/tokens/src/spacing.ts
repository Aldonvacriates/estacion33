export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 48,
  8: 64,
  9: 96,
} as const;

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  pill: 9999,
} as const;

export const borderWidth = {
  0: 0,
  1: 1,
  2: 2,
} as const;

export const sizes = {
  tap: 44,
  buttonSm: 32,
  buttonMd: 40,
  buttonLg: 48,
  inputMd: 44,
  appBar: 56,
  bottomNav: 64,
  containerSm: 640,
  containerMd: 768,
  containerLg: 1024,
  containerXl: 1280,
  containerMax: 1440,
} as const;

export type Spacing = typeof spacing;
export type Radii = typeof radii;
export type Sizes = typeof sizes;
