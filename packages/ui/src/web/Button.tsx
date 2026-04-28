'use client';

import { useState, type ButtonHTMLAttributes, type CSSProperties } from 'react';
import {
  buttonColors,
  buttonFontSize,
  buttonHeight,
  buttonPaddingX,
  buttonRadius,
  type ButtonSize,
  type ButtonVariant,
} from '../button-spec';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled,
  style,
  children,
  ...rest
}: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const palette = buttonColors[variant];

  const bg = disabled
    ? palette.bg
    : active
      ? palette.bgActive
      : hover
        ? palette.bgHover
        : palette.bg;

  const css: CSSProperties = {
    height: buttonHeight[size],
    paddingInline: buttonPaddingX[size],
    fontSize: buttonFontSize[size],
    fontWeight: 600,
    fontFamily: 'Poppins, system-ui, sans-serif',
    background: bg,
    color: palette.fg,
    border: 'none',
    borderRadius: buttonRadius,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
    transition: 'background 120ms ease',
    letterSpacing: '0.04em',
    ...style,
  };

  return (
    <button
      {...rest}
      disabled={disabled}
      style={css}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setActive(false);
      }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
    >
      {children}
    </button>
  );
}
