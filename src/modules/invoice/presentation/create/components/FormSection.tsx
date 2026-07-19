import React, { PropsWithChildren } from 'react';
import { AppText, Box, colors, radius, spacing } from '@core/ui';

/** Fieldset-style group: bordered box with an uppercase legend. */
export function FormSection({
  legend,
  children,
}: PropsWithChildren<{ legend: string }>) {
  return (
    <Box
      gap="md"
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.md,
      }}
    >
      <AppText
        variant="caption"
        color={colors.textMuted}
        style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}
      >
        {legend}
      </AppText>
      {children}
    </Box>
  );
}
