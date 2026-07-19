import React from 'react';

import { AppText } from '../../../primitives/AppText';
import { Box } from '../../../primitives/Box';
import { Spinner } from '../../../primitives/Spinner';
import { colors, radius, spacing } from '../../../theme/tokens';
import { useModalContext } from '../context';

/** Blocking spinner — not backdrop-dismissable; close via closeModal(). */
export function LoadingModal() {
  const { message } = useModalContext('loading');

  return (
    <Box
      align="center"
      gap="sm"
      style={{
        minWidth: 120,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
      }}
    >
      <Spinner />
      {message ? (
        <AppText variant="caption" color={colors.textMuted}>
          {message}
        </AppText>
      ) : null}
    </Box>
  );
}
