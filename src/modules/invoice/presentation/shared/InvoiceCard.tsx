import React from 'react';
import { Pressable } from 'react-native';
import { AppText, Box, colors, radius, spacing } from '@core/ui';
import { formatMoney } from '@core/utils/formatMoney';

import type { Invoice } from '../../domain/schemas/invoice';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';

interface InvoiceCardProps {
  invoice: Invoice;
  onPress: (invoice: Invoice) => void;
}

export function InvoiceCard({ invoice, onPress }: InvoiceCardProps) {
  return (
    <Pressable
      onPress={() => onPress(invoice)}
      accessibilityRole="button"
      accessibilityLabel={`Invoice ${invoice.invoiceNumber}, ${invoice.status}`}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.background : colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.md,
      })}
    >
      <Box row justify="space-between" align="center" style={{ marginBottom: 2 }}>
        <AppText variant="caption" style={{ fontSize: 14, fontWeight: '600' }}>
          {invoice.invoiceNumber}
        </AppText>
        <AppText variant="caption" style={{ fontSize: 14, fontWeight: '600' }}>
          {formatMoney(invoice.totalAmount, invoice.currency)}
        </AppText>
      </Box>
      <Box row justify="space-between" align="center">
        <AppText variant="caption" color={colors.textMuted}>
          {invoice.customerName}
        </AppText>
        <InvoiceStatusBadge status={invoice.status} />
      </Box>
      <AppText
        variant="caption"
        color={colors.textMuted}
        style={{ fontSize: 11.5, marginTop: spacing.xs }}
      >
        Created {invoice.createdDate} · Due {invoice.dueDate}
      </AppText>
    </Pressable>
  );
}
