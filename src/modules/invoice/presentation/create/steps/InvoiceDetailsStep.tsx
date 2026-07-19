import React from 'react';
import { Box, ElementField } from '@core/ui';

import { useCreateInvoiceFlow } from '../context';
import { CURRENCY_OPTIONS } from '../form';
import { FormSection } from '../components/FormSection';

export function InvoiceDetailsStep() {
  const { form } = useCreateInvoiceFlow();
  const { control } = form;

  return (
    <Box gap="md">
      <FormSection legend="Identification">
        <ElementField
          id="invoiceNumber"
          type="text"
          name="invoiceNumber"
          control={control}
          placeholder="INV123456701"
          inputProps={{ autoCapitalize: 'characters' }}
          ui={{ label: 'Invoice number', mandatory: true }}
        />
        <ElementField
          id="invoiceReference"
          type="text"
          name="invoiceReference"
          control={control}
          placeholder="#123456"
          ui={{ label: 'Invoice reference', mandatory: true }}
        />
        <ElementField
          id="description"
          type="text"
          name="description"
          control={control}
          multiline
          placeholder="Invoice is issued to…"
          ui={{ label: 'Description' }}
        />
      </FormSection>

      <FormSection legend="Currency & dates">
        <ElementField
          id="currency"
          type="selection"
          name="currency"
          control={control}
          single
          options={CURRENCY_OPTIONS}
          placeholder="Select…"
          title="Currency"
          ui={{ label: 'Currency', mandatory: true }}
        />
        <Box row gap="sm">
          <ElementField
            id="invoiceDate"
            type="date"
            name="invoiceDate"
            control={control}
            ui={{ label: 'Invoice date', mandatory: true, containerStyle: { flex: 1 } }}
          />
          <ElementField
            id="dueDate"
            type="date"
            name="dueDate"
            control={control}
            ui={{ label: 'Due date', mandatory: true, containerStyle: { flex: 1 } }}
          />
        </Box>
      </FormSection>
    </Box>
  );
}
