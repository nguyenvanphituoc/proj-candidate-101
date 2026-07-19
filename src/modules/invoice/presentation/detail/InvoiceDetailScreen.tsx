import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AppText, Box, colors, radius, Screen, spacing } from '@core/ui';
import { formatMoney } from '@core/utils/formatMoney';

import type { Invoice } from '../../domain/schemas/invoice';
import { InvoiceStatusBadge } from '../shared/InvoiceStatusBadge';

/** Route params — re-exported through the module index for app/routes.ts. */
export type InvoiceDetailParams = { invoice: Invoice };

type DetailRoute = RouteProp<{ InvoiceDetail: InvoiceDetailParams }, 'InvoiceDetail'>;

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <Box row justify="space-between" gap="md" style={{ paddingVertical: 3 }}>
      <AppText variant="caption" color={colors.textMuted}>
        {label}
      </AppText>
      <AppText variant="caption" style={{ flex: 1, textAlign: 'right' }}>
        {value}
      </AppText>
    </Box>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <AppText
      variant="caption"
      color={colors.textMuted}
      style={{
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
      }}
    >
      {children}
    </AppText>
  );
}

export function InvoiceDetailScreen() {
  const navigation = useNavigation();
  const { invoice } = useRoute<DetailRoute>().params;

  return (
    <Screen>
      <Box
        row
        align="center"
        justify="space-between"
        style={{ paddingVertical: spacing.md }}
      >
        <Box row align="center" gap="sm" flex={1}>
          <Pressable
            onPress={navigation.goBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Back to invoice list"
          >
            <AppText style={{ fontSize: 22 }}>←</AppText>
          </Pressable>
          <AppText variant="subtitle" numberOfLines={1} style={{ flexShrink: 1 }}>
            {invoice.invoiceNumber}
          </AppText>
        </Box>
        <InvoiceStatusBadge status={invoice.status} />
      </Box>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Box align="center" style={{ paddingVertical: spacing.lg }}>
          <AppText variant="title" style={{ fontSize: 28 }}>
            {formatMoney(invoice.totalAmount, invoice.currency)}
          </AppText>
          <AppText variant="caption" color={colors.textMuted}>
            Due {invoice.dueDate}
          </AppText>
        </Box>

        <Box
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radius.md,
            backgroundColor: colors.surface,
            padding: spacing.md,
            marginBottom: spacing.md,
          }}
        >
          <SectionLabel>Invoice</SectionLabel>
          <KeyValue label="Reference" value={invoice.invoiceReference} />
          <KeyValue label="Created" value={invoice.createdDate} />
          <KeyValue label="Description" value={invoice.description} />

          <SectionLabel>Customer</SectionLabel>
          <KeyValue label="Name" value={invoice.customerName} />

          <SectionLabel>Line item</SectionLabel>
          <KeyValue label="Item" value={invoice.itemName} />
          <KeyValue
            label="Qty × rate"
            value={`${invoice.quantity} × ${formatMoney(
              invoice.rate,
              invoice.currency,
            )}`}
          />
        </Box>
      </ScrollView>
    </Screen>
  );
}
