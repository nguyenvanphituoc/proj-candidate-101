import React from 'react';
import { colors } from '../theme/tokens';
import { AppInput, AppInputProps } from '../primitives/AppInput';
import { AppText } from '../primitives/AppText';
import { Box } from '../primitives/Box';

export interface TextFieldProps extends AppInputProps {
  label: string;
  error?: string;
}

export function TextField({ label, error, ...inputProps }: TextFieldProps) {
  return (
    <Box gap="xs">
      <AppText variant="caption" color={colors.textMuted}>
        {label}
      </AppText>
      <AppInput hasError={!!error} {...inputProps} />
      {error ? (
        <AppText variant="caption" color={colors.danger}>
          {error}
        </AppText>
      ) : null}
    </Box>
  );
}
