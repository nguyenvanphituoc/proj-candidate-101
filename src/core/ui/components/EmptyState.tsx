import React from 'react';
import { colors } from '../theme/tokens';
import { AppText } from '../primitives/AppText';
import { Box } from '../primitives/Box';

interface EmptyStateProps {
  title: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <Box flex={1} align="center" justify="center" gap="xs" padding="lg">
      <AppText variant="subtitle">{title}</AppText>
      {message ? (
        <AppText color={colors.textMuted} style={{ textAlign: 'center' }}>
          {message}
        </AppText>
      ) : null}
    </Box>
  );
}
