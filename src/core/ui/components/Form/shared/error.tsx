import React from 'react';
import { AppText } from '../../../primitives/AppText';
import { colors } from '../../../theme/tokens';
import { ElementFormErrorProps } from './type';

export function ElementFormError({
  showError = true,
  errorMessage,
}: ElementFormErrorProps) {
  if (!showError || !errorMessage) return null;

  return (
    <AppText variant="caption" color={colors.danger}>
      {errorMessage}
    </AppText>
  );
}
