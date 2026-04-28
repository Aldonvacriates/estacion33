import { useState } from 'react';
import { Pressable, Text, type PressableProps, type ViewStyle } from 'react-native';
import {
  buttonColors,
  buttonFontSize,
  buttonHeight,
  buttonPaddingX,
  buttonRadius,
  type ButtonSize,
  type ButtonVariant,
} from '../button-spec';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const palette = buttonColors[variant];

  const bg = disabled ? palette.bg : pressed ? palette.bgActive : palette.bg;

  return (
    <Pressable
      {...rest}
      disabled={disabled ?? false}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={{
        height: buttonHeight[size],
        paddingHorizontal: buttonPaddingX[size],
        backgroundColor: bg,
        borderRadius: buttonRadius,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.5 : 1,
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        ...style,
      }}
    >
      <Text
        style={{
          color: palette.fg,
          fontSize: buttonFontSize[size],
          fontWeight: '600',
          fontFamily: 'Poppins',
          letterSpacing: 0.6,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
