import React from 'react';
import { AppText } from '../../../primitives/AppText';
import { Box } from '../../../primitives/Box';
import { colors } from '../../../theme/tokens';
import { ElementFormHeaderProps } from './type';

export function ElementFormHeader({
  label,
  required,
  headerStyle,
}: ElementFormHeaderProps) {
  if (!label) return null;

  return (
    <Box row align="center" style={headerStyle}>
      <AppText variant="caption" color={colors.textMuted}>
        {label}
        {required ? <AppText variant="caption" color={colors.danger}> *</AppText> : null}
      </AppText>
    </Box>
  );
}
