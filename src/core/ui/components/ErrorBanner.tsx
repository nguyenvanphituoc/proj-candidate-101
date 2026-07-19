import React from 'react';
import { Pressable } from 'react-native';
import { colors, radius } from '../theme/tokens';
import { AppText } from '../primitives/AppText';
import { Box } from '../primitives/Box';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <Box
      row
      align="center"
      gap="sm"
      padding="sm"
      style={{
        backgroundColor: colors.dangerSurface,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.danger,
      }}
    >
      <AppText variant="caption" color={colors.danger} style={{ flex: 1 }}>
        {message}
      </AppText>
      {onRetry ? (
        <Pressable onPress={onRetry} hitSlop={8} accessibilityRole="button">
          <AppText
            variant="caption"
            color={colors.danger}
            style={{ fontWeight: '600' }}
          >
            Retry
          </AppText>
        </Pressable>
      ) : null}
    </Box>
  );
}
