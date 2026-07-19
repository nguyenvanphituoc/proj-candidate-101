import React, { useState } from 'react';
import { Platform, Pressable } from 'react-native';
import { AppText, Box, colors, radius, spacing } from '@core/ui';

import { useCreateInvoiceFlow } from '../context';
import { buildCreateInvoicePayload } from '../../../data/invoiceMapper';
import { ReviewBlock } from '../components/ReviewBlock';

export function ReviewStep() {
  const { form, goToStep } = useCreateInvoiceFlow();
  const [showPayload, setShowPayload] = useState(false);

  const values = form.getValues();
  const quantity = Number(values.quantity) || 0;
  const rate = Number(values.rate) || 0;
  const currencyCode = values.currency[0]?.id ?? '';

  return (
    <Box gap="md">
      <ReviewBlock
        title="Customer"
        onEdit={() => goToStep(1)}
        rows={[
          ['Name', `${values.firstName} ${values.lastName}`.trim()],
          ['Email', values.email],
          ['Mobile', values.mobileNumber],
          [
            'Address',
            [
              values.premise,
              values.city,
              values.county,
              values.postcode,
              values.countryCode[0]?.id,
            ]
              .filter(Boolean)
              .join(', '),
          ],
        ]}
      />
      <ReviewBlock
        title="Invoice"
        onEdit={() => goToStep(2)}
        rows={[
          ['Number', values.invoiceNumber],
          ['Reference', values.invoiceReference],
          ['Currency', currencyCode],
          ['Invoice date', values.invoiceDate],
          ['Due date', values.dueDate],
        ]}
      />
      <ReviewBlock
        title="Line item"
        onEdit={() => goToStep(3)}
        rows={[
          ['Item', values.itemName],
          [
            'Qty × rate',
            `${values.quantity} × ${values.rate} / ${values.itemUOM[0]?.id ?? ''}`,
          ],
          [
            'Line total',
            `${(quantity * rate).toLocaleString()} ${currencyCode}`.trim(),
          ],
        ]}
      />
      <ReviewBlock
        title="Payment"
        onEdit={() => goToStep(4)}
        rows={[
          ['Account', values.accountName],
          ['Sort code', values.sortCode],
          ['Account no.', values.accountNumber],
          ['Tax', values.taxPercent ? `${values.taxPercent}% (ADD)` : '—'],
          ['Discount', values.discountFixed ? `${values.discountFixed} (DEDUCT)` : '—'],
        ]}
      />

      <Pressable onPress={() => setShowPayload(prev => !prev)}>
        <AppText variant="caption" color={colors.textMuted}>
          {showPayload ? '▾' : '▸'} API payload preview (POST
          /invoice-service/1.0.0/invoices)
        </AppText>
      </Pressable>
      {showPayload && (
        <Box
          style={{
            backgroundColor: colors.text,
            borderRadius: radius.md,
            padding: spacing.md,
          }}
        >
          <AppText
            variant="caption"
            color={colors.background}
            style={{
              fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
              fontSize: 11,
            }}
          >
            {JSON.stringify(buildCreateInvoicePayload(values), null, 2)}
          </AppText>
        </Box>
      )}
    </Box>
  );
}
