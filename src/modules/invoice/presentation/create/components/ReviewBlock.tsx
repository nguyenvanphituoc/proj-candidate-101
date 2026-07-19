import React from 'react';
import { Pressable } from 'react-native';
import { AppText, Box, colors, radius, spacing } from '@core/ui';

interface ReviewBlockProps {
  title: string;
  rows: Array<[label: string, value: string]>;
  onEdit: () => void;
}

/** Read-only summary card with an Edit link jumping back to its step. */
export function ReviewBlock({ title, rows, onEdit }: ReviewBlockProps) {
  return (
    <Box
      style={{
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        overflow: 'hidden',
      }}
    >
      <Box
        row
        align="center"
        justify="space-between"
        style={{
          backgroundColor: colors.background,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
        }}
      >
        <AppText variant="caption" style={{ fontWeight: '600' }}>
          {title}
        </AppText>
        <Pressable onPress={onEdit} hitSlop={8} accessibilityRole="button">
          <AppText variant="caption" color={colors.primary}>
            Edit
          </AppText>
        </Pressable>
      </Box>
      <Box gap="xs" style={{ padding: spacing.md }}>
        {rows.map(([label, value]) => (
          <Box key={label} row gap="sm" justify="space-between">
            <AppText variant="caption" color={colors.textMuted}>
              {label}
            </AppText>
            <AppText
              variant="caption"
              style={{ flexShrink: 1, textAlign: 'right' }}
            >
              {value || '—'}
            </AppText>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
