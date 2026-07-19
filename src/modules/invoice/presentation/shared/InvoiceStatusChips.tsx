import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { AppText, Box, colors, radius, spacing } from '@core/ui';

import type { InvoiceStatus } from '../../domain/schemas/invoice';
import { INVOICE_STATUSES } from '../../domain/schemas/invoice';

const CHIPS: Array<{ value: InvoiceStatus | ''; label: string }> = [
  { value: '', label: 'All' },
  ...INVOICE_STATUSES.map(status => ({ value: status, label: status })),
];

interface InvoiceStatusChipsProps {
  value: InvoiceStatus | '';
  onChange: (value: InvoiceStatus | '') => void;
}

export function InvoiceStatusChips({ value, onChange }: InvoiceStatusChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Box row gap="sm">
        {CHIPS.map(chip => {
          const isActive = chip.value === value;
          return (
            <Pressable
              key={chip.label}
              onPress={() => onChange(chip.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Box
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: 6,
                  borderRadius: radius.full,
                  borderWidth: 1,
                  borderColor: isActive ? colors.primary : colors.border,
                  backgroundColor: isActive ? colors.primary : colors.surface,
                }}
              >
                <AppText
                  variant="caption"
                  color={isActive ? colors.onPrimary : colors.textMuted}
                  style={{ fontWeight: '500' }}
                >
                  {chip.label}
                </AppText>
              </Box>
            </Pressable>
          );
        })}
      </Box>
    </ScrollView>
  );
}
