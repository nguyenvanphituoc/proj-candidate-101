import React from 'react';
import { Box, ElementField } from '@core/ui';

import { useCreateInvoiceFlow } from '../context';
import { COUNTRY_OPTIONS } from '../form';
import { FormSection } from '../components/FormSection';

export function CustomerStep() {
  const { form } = useCreateInvoiceFlow();
  const { control } = form;

  return (
    <Box gap="md">
      <FormSection legend="Contact">
        <Box row gap="sm">
          <ElementField
            id="firstName"
            type="text"
            name="firstName"
            control={control}
            placeholder="Nguyen"
            ui={{ label: 'First name', mandatory: true, containerStyle: { flex: 1 } }}
          />
          <ElementField
            id="lastName"
            type="text"
            name="lastName"
            control={control}
            placeholder="Dung"
            ui={{ label: 'Last name', mandatory: true, containerStyle: { flex: 1 } }}
          />
        </Box>
        <ElementField
          id="email"
          type="text"
          name="email"
          control={control}
          placeholder="customer@example.com"
          inputProps={{
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            autoCorrect: false,
          }}
          ui={{ label: 'Email', mandatory: true }}
        />
        <ElementField
          id="mobileNumber"
          type="text"
          name="mobileNumber"
          control={control}
          placeholder="+6597594971"
          inputProps={{ keyboardType: 'phone-pad' }}
          ui={{ label: 'Mobile number', mandatory: true }}
        />
      </FormSection>

      <FormSection legend="Billing address">
        <ElementField
          id="premise"
          type="text"
          name="premise"
          control={control}
          placeholder="CT11"
          ui={{ label: 'Premise', mandatory: true }}
        />
        <Box row gap="sm">
          <ElementField
            id="city"
            type="text"
            name="city"
            control={control}
            placeholder="Hanoi"
            ui={{ label: 'City', mandatory: true, containerStyle: { flex: 1 } }}
          />
          <ElementField
            id="county"
            type="text"
            name="county"
            control={control}
            placeholder="Hoang Mai"
            ui={{ label: 'County', mandatory: true, containerStyle: { flex: 1 } }}
          />
        </Box>
        <Box row gap="sm">
          <ElementField
            id="postcode"
            type="text"
            name="postcode"
            control={control}
            placeholder="1000"
            ui={{ label: 'Postcode', mandatory: true, containerStyle: { flex: 1 } }}
          />
          <ElementField
            id="countryCode"
            type="selection"
            name="countryCode"
            control={control}
            single
            options={COUNTRY_OPTIONS}
            placeholder="Select…"
            title="Country"
            ui={{ label: 'Country', mandatory: true, containerStyle: { flex: 1 } }}
          />
        </Box>
      </FormSection>
    </Box>
  );
}
