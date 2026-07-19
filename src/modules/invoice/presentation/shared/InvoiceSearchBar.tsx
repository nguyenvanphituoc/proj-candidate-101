import React from 'react';
import { Pressable } from 'react-native';
import { AppInput, AppText, Box, colors } from '@core/ui';

interface InvoiceSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export function InvoiceSearchBar({
  value,
  onChange,
  onClear,
}: InvoiceSearchBarProps) {
  return (
    <Box style={{ position: 'relative' }}>
      <AppInput
        value={value}
        onChangeText={onChange}
        placeholder="Search by invoice number…"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Search invoices"
        style={{ paddingRight: 40 }}
      />
      {value !== '' ? (
        <Pressable
          onPress={onClear}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          style={{
            position: 'absolute',
            right: 12,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
          }}
        >
          <AppText color={colors.textMuted}>✕</AppText>
        </Pressable>
      ) : null}
    </Box>
  );
}
