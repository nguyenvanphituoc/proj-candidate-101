import React from 'react';
import { AppText, Box, colors } from '@core/ui';

interface StepperProps {
  step: number;
  total: number;
  label: string;
}

/** Segmented progress bar + "Step X of Y — Name" caption. */
export function Stepper({ step, total, label }: StepperProps) {
  return (
    <Box gap="xs">
      <Box row gap="xs">
        {Array.from({ length: total }, (_, i) => (
          <Box
            key={i}
            flex={1}
            style={{
              height: 4,
              borderRadius: 2,
              backgroundColor: i < step ? colors.primary : colors.border,
            }}
          />
        ))}
      </Box>
      <AppText variant="caption" color={colors.textMuted}>
        Step {step} of {total} — {label}
      </AppText>
    </Box>
  );
}
