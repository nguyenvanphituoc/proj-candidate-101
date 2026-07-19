import React, { PropsWithChildren } from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/tokens';

interface ScreenProps extends PropsWithChildren {
  /** wrap content in a ScrollView (forms); lists manage their own scrolling */
  scroll?: boolean;
}

/**
 * Root of every screen — the one place safe-area insets are consumed
 * (TECH_SPEC §3, edge-to-edge).
 */
export function Screen({ scroll = false, children }: ScreenProps) {
  const insets = useSafeAreaInsets();

  const container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left + spacing.md,
    paddingRight: insets.right + spacing.md,
  };

  if (scroll) {
    return (
      <View style={container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: spacing.md }}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return <View style={container}>{children}</View>;
}
