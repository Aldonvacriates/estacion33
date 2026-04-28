export const fontFamilies = {
  sans: 'Poppins, system-ui, sans-serif',
  display: 'Poppins, system-ui, sans-serif',
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
} as const;

export const fontSizes = {
  xs: 11,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 56,
} as const;

export const lineHeights = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.7,
} as const;

export const letterSpacing = {
  tight: '-0.02em',
  normal: '0',
  wide: '0.04em',
} as const;

type TypographyToken = {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
};

export const typography = {
  display: {
    fontFamily: fontFamilies.display,
    fontWeight: fontWeights.black,
    fontSize: fontSizes['5xl'],
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  },
  h1: {
    fontFamily: fontFamilies.display,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes['4xl'],
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamilies.display,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes['3xl'],
    lineHeight: lineHeights.snug,
  },
  h3: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights.snug,
  },
  h4: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.snug,
  },
  bodyLg: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.normal,
  },
  body: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.normal,
  },
  bodySm: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.base,
    lineHeight: lineHeights.normal,
  },
  label: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.regular,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.snug,
  },
  buttonLg: {
    fontFamily: fontFamilies.sans,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.wide,
  },
  price: {
    fontFamily: fontFamilies.display,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  },
} as const satisfies Record<string, TypographyToken>;

export type Typography = typeof typography;
