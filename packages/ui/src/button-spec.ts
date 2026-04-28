import { colors, radii, sizes, spacing } from '@estacion33/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export const buttonHeight: Record<ButtonSize, number> = {
  sm: sizes.buttonSm,
  md: sizes.buttonMd,
  lg: sizes.buttonLg,
};

export const buttonPaddingX: Record<ButtonSize, number> = {
  sm: spacing[2],
  md: spacing[3],
  lg: spacing[4],
};

export const buttonFontSize: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 16,
};

export const buttonRadius = radii.md;

export const buttonColors = {
  primary: {
    bg: colors.brand.primary,
    bgHover: colors.brand.primaryHover,
    bgActive: colors.brand.primaryActive,
    fg: colors.neutral[0],
  },
  secondary: {
    bg: colors.brand.secondary,
    bgHover: colors.brand.secondaryHover,
    bgActive: colors.brand.secondary700,
    fg: colors.neutral[0],
  },
  ghost: {
    bg: 'transparent',
    bgHover: colors.neutral[100],
    bgActive: colors.neutral[200],
    fg: colors.brand.primaryDark,
  },
} as const satisfies Record<
  ButtonVariant,
  { bg: string; bgHover: string; bgActive: string; fg: string }
>;
