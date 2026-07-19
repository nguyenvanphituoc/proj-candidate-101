import React from 'react';
import { Box, ElementField } from '@core/ui';

import { useCreateInvoiceFlow } from '../context';
import { FormSection } from '../shared/FormSection';

export function PaymentStep() {
  const { form } = useCreateInvoiceFlow();
  const { control } = form;

  return (
    <Box gap="md">
      <FormSection legend="Bank account">
        <ElementField
          id="accountName"
          type="text"
          name="accountName"
          control={control}
          placeholder="John Terry"
          ui={{ label: 'Account name', mandatory: true }}
        />
        <Box row gap="sm">
          <ElementField
            id="sortCode"
            type="text"
            name="sortCode"
            control={control}
            placeholder="09-01-01"
            ui={{ label: 'Sort code', mandatory: true, containerStyle: { flex: 1 } }}
          />
          <ElementField
            id="accountNumber"
            type="text"
            name="accountNumber"
            control={control}
            placeholder="12345678"
            replacePattern={/[^0-9]/g}
            inputProps={{ keyboardType: 'number-pad' }}
            ui={{ label: 'Account number', mandatory: true, containerStyle: { flex: 1 } }}
          />
        </Box>
      </FormSection>

      <FormSection legend="Adjustments (extensions)">
        <Box row gap="sm">
          <ElementField
            id="taxPercent"
            type="text"
            name="taxPercent"
            control={control}
            placeholder="10"
            replacePattern={/[^0-9.]/g}
            inputProps={{ keyboardType: 'decimal-pad' }}
            ui={{ label: 'Tax (% add)', containerStyle: { flex: 1 } }}
          />
          <ElementField
            id="discountFixed"
            type="text"
            name="discountFixed"
            control={control}
            placeholder="10.00"
            replacePattern={/[^0-9.]/g}
            inputProps={{ keyboardType: 'decimal-pad' }}
            ui={{ label: 'Discount (fixed deduct)', containerStyle: { flex: 1 } }}
          />
        </Box>
      </FormSection>
    </Box>
  );
}
