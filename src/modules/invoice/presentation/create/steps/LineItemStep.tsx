import React from 'react';
import { useWatch } from 'react-hook-form';
import { AppText, Box, colors, ElementField } from '@core/ui';

import { useCreateInvoiceFlow } from '../context';
import { UOM_OPTIONS } from '../form';
import { FormSection } from '../shared/FormSection';

function LineTotalPreview() {
  const { form } = useCreateInvoiceFlow();
  const [quantity, rate, currency] = useWatch({
    control: form.control,
    name: ['quantity', 'rate', 'currency'],
  });

  const q = Number(quantity);
  const r = Number(rate);
  const hasTotal = q > 0 && r > 0;

  return (
    <AppText variant="caption" color={colors.textMuted}>
      {hasTotal
        ? `Line total: ${(q * r).toLocaleString()} ${currency[0]?.id ?? ''}`.trim()
        : 'Line total: —'}
    </AppText>
  );
}

export function LineItemStep() {
  const { form } = useCreateInvoiceFlow();
  const { control } = form;

  return (
    <Box gap="md">
      <FormSection legend="Item">
        <ElementField
          id="itemName"
          type="text"
          name="itemName"
          control={control}
          placeholder="Honda Motor"
          ui={{ label: 'Item name', mandatory: true }}
        />
        <ElementField
          id="itemReference"
          type="text"
          name="itemReference"
          control={control}
          placeholder="itemRef"
          ui={{ label: 'Item reference', mandatory: true }}
        />
        <ElementField
          id="itemDescription"
          type="text"
          name="itemDescription"
          control={control}
          placeholder="Honda RC150"
          ui={{ label: 'Item description' }}
        />
      </FormSection>

      <FormSection legend="Quantity & rate">
        <Box row gap="sm">
          <ElementField
            id="quantity"
            type="text"
            name="quantity"
            control={control}
            placeholder="1"
            replacePattern={/[^0-9]/g}
            inputProps={{ keyboardType: 'number-pad' }}
            ui={{ label: 'Quantity', mandatory: true, containerStyle: { flex: 1 } }}
          />
          <ElementField
            id="rate"
            type="text"
            name="rate"
            control={control}
            placeholder="1000"
            replacePattern={/[^0-9.]/g}
            inputProps={{ keyboardType: 'decimal-pad' }}
            ui={{ label: 'Rate', mandatory: true, containerStyle: { flex: 1 } }}
          />
          <ElementField
            id="itemUOM"
            type="selection"
            name="itemUOM"
            control={control}
            single
            options={UOM_OPTIONS}
            title="Unit"
            ui={{ label: 'Unit', containerStyle: { flex: 1 } }}
          />
        </Box>
        <LineTotalPreview />
      </FormSection>
    </Box>
  );
}
