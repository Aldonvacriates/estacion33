import { colors } from './colors';
import { spacing, radii, sizes } from './spacing';
import { shadows } from './shadows';

const flatten = (
  obj: Record<string, unknown>,
  prefix: string,
): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const name = `${prefix}-${key}`;
    if (value && typeof value === 'object') {
      Object.assign(out, flatten(value as Record<string, unknown>, name));
    } else {
      out[name] = String(value);
    }
  }
  return out;
};

const pxify = (entries: Record<string, number>, prefix: string): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(entries)) {
    out[`${prefix}-${key}`] = `${value}px`;
  }
  return out;
};

export const cssVariables: Record<string, string> = {
  ...flatten(colors, '--color'),
  ...pxify(spacing, '--space'),
  ...pxify(radii, '--radius'),
  ...pxify(sizes, '--size'),
  ...Object.fromEntries(Object.entries(shadows).map(([k, v]) => [`--shadow-${k}`, v])),
};

export const cssVariablesString = (selector = ':root'): string => {
  const lines = Object.entries(cssVariables).map(([k, v]) => `  ${k}: ${v};`);
  return `${selector} {\n${lines.join('\n')}\n}\n`;
};
