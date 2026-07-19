import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { AppButton, AppText, Box, EmptyState, Screen } from '@core/ui';
import { useAuthSession } from '@/app/providers/AuthSessionProvider';

/**
 * [PLACEHOLDER] Real list (search, sort, filter, useInfiniteQuery) lands with
 * the invoice module per TECH_SPEC §4.
 */
export function InvoiceListScreen() {
  const navigation = useNavigation();
  const { signOut } = useAuthSession();

  return (
    <Screen>
      <Box row align="center" justify="space-between" style={{ paddingVertical: 16 }}>
        <AppText variant="title">Invoices</AppText>
        <AppButton title="Sign out" variant="secondary" onPress={signOut} />
      </Box>
      <EmptyState
        title="No invoices yet"
        message="Create your first invoice to see it here."
      />
      <Box style={{ paddingBottom: 16 }}>
        <AppButton
          title="Create invoice"
          onPress={() => navigation.navigate('CreateInvoice')}
        />
      </Box>
    </Screen>
  );
}
