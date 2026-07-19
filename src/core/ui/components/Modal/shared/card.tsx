import React from 'react';
import { Pressable } from 'react-native';

import { AppText } from '../../../primitives/AppText';
import { Box } from '../../../primitives/Box';
import { colors, radius, spacing } from '../../../theme/tokens';

interface ModalCardProps {
  title?: string;
  /** Renders a ✕ button in the header when provided. */
  onClose?: () => void;
}

/** Shared surface for dialog-style leaves (loading uses its own compact box). */
export function ModalCard({
  title,
  onClose,
  children,
}: React.PropsWithChildren<ModalCardProps>) {
  return (
    <Box
      gap="md"
      style={{
        width: '100%',
        maxWidth: 360,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
      }}
    >
      {(title || onClose) && (
        <Box row align="center" justify="space-between">
          <AppText variant="subtitle">{title}</AppText>
          {onClose && (
            <Pressable onPress={onClose} accessibilityRole="button" hitSlop={8}>
              <AppText color={colors.textMuted} variant="subtitle">
                ✕
              </AppText>
            </Pressable>
          )}
        </Box>
      )}
      {children}
    </Box>
  );
}
