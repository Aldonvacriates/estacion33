export { colors, type Colors } from './colors';
export {
  spacing,
  radii,
  borderWidth,
  sizes,
  type Spacing,
  type Radii,
  type Sizes,
} from './spacing';
export {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  typography,
  type Typography,
} from './typography';
export { shadows, type Shadows } from './shadows';

import { colors } from './colors';
import { spacing, radii, sizes } from './spacing';
import { typography } from './typography';
import { shadows } from './shadows';

export const tokens = {
  colors,
  spacing,
  radii,
  sizes,
  typography,
  shadows,
} as const;

export type Tokens = typeof tokens;
