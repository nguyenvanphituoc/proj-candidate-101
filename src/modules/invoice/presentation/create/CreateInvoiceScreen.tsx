import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { AppButton, AppText, Box, Screen } from '@core/ui';

/**
 * [PLACEHOLDER] Real form (react-hook-form + InvoiceDraftSchema) lands with
 * the invoice module per TECH_SPEC §4.
 */
export function CreateInvoiceScreen() {
  const navigation = useNavigation();

  return (
    <Screen scroll>
      <Box gap="md" style={{ paddingTop: 16 }}>
        <AppText variant="title">New invoice</AppText>
        <AppText>Invoice form coming with the invoice module.</AppText>
        <AppButton
          title="Back to list"
          variant="secondary"
          onPress={() => navigation.goBack()}
        />
      </Box>
    </Screen>
  );
}
