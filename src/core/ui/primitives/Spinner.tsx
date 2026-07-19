import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors, spacing } from '../theme/tokens';

interface SpinnerProps {
  /** center in the available space (full-screen / list loading states) */
  fill?: boolean;
}

export function Spinner({ fill = false }: SpinnerProps) {
  if (!fill) {
    return <ActivityIndicator color={colors.primary} />;
  }
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
