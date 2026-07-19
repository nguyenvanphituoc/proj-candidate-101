import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/tokens';

export interface AppInputProps extends TextInputProps {
  hasError?: boolean;
}

export const AppInput = forwardRef<TextInput, AppInputProps>(function AppInputBase(
  { hasError = false, style, ...rest },
  ref,
) {
  return (
    <TextInput
      ref={ref}
      placeholderTextColor={colors.textMuted}
      style={[
        {
          height: 48,
          borderWidth: 1,
          borderColor: hasError ? colors.danger : colors.border,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          backgroundColor: colors.surface,
          color: colors.text,
          fontSize: typography.body.fontSize,
        },
        style,
      ]}
      {...rest}
    />
  );
});
