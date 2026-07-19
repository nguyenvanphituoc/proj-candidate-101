import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { AppText } from './AppText';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: AppButtonProps) {
  const isPrimary = variant === 'primary';
  const blocked = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={blocked}
      accessibilityRole="button"
      style={({ pressed }) => ({
        height: 48,
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
        backgroundColor: !isPrimary
          ? 'transparent'
          : blocked
          ? colors.disabled
          : pressed
          ? colors.primaryPressed
          : colors.primary,
        borderWidth: isPrimary ? 0 : 1,
        borderColor: colors.border,
        opacity: !isPrimary && blocked ? 0.5 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.onPrimary : colors.primary} />
      ) : (
        <AppText
          variant="body"
          color={isPrimary ? colors.onPrimary : colors.text}
          style={{ fontWeight: '600' }}
        >
          {title}
        </AppText>
      )}
    </Pressable>
  );
}
