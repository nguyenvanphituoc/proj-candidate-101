import React from 'react';
import { Text, TextProps } from 'react-native';
import { colors, typography, TypographyVariant } from '../theme/tokens';

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
}

export function AppText({
  variant = 'body',
  color = colors.text,
  style,
  ...rest
}: AppTextProps) {
  return <Text style={[typography[variant], { color }, style]} {...rest} />;
}
