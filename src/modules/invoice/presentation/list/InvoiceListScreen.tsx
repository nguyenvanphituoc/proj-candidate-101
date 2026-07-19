import React, { useCallback } from 'react';
import { FlatList, Pressable, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  AppText,
  Box,
  colors,
  EmptyState,
  ErrorBanner,
  radius,
  Screen,
  spacing,
  Spinner,
  useRootModal,
} from '@core/ui';
import { useAuthSession } from '@/app/providers/AuthSessionProvider';

import type { Invoice } from '../../domain/schemas/invoice';
import { InvoiceCard } from '../shared/InvoiceCard';
import { InvoiceSearchBar } from '../shared/InvoiceSearchBar';
import { InvoiceStatusChips } from '../shared/InvoiceStatusChips';
import { InvoiceListProvider, useInvoiceList } from './context';

function IconButton({
  glyph,
  label,
  onPress,
}: {
  glyph: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.sm,
        backgroundColor: pressed ? colors.background : colors.surface,
      })}
    >
      <AppText>{glyph}</AppText>
    </Pressable>
  );
}

function ListFooter() {
  const { invoices, total, isFetchingNextPage } = useInvoiceList();

  if (invoices.length === 0) return null;
  return (
    <Box align="center" gap="sm" style={{ paddingVertical: spacing.md }}>
      {isFetchingNextPage ? <Spinner /> : null}
      <AppText variant="caption" color={colors.textMuted}>
        Showing {invoices.length} of {total}
      </AppText>
    </Box>
  );
}

function ListEmpty() {
  const { isLoading, isError, hasActiveFilters, refetch } = useInvoiceList();

  if (isLoading) return <Spinner fill />;
  if (isError) {
    return (
      <Box style={{ paddingVertical: spacing.md }}>
        <ErrorBanner
          message="Could not load invoices. Check your connection and try again."
          onRetry={refetch}
        />
      </Box>
    );
  }
  return (
    <EmptyState
      title="No invoices found"
      message={
        hasActiveFilters
          ? 'Try clearing your search or filters.'
          : 'Tap + to create your first invoice.'
      }
    />
  );
}

function InvoiceListContent() {
  const navigation = useNavigation();
  const { signOut } = useAuthSession();
  const { openModal } = useRootModal();
  const {
    keywordInput,
    setKeywordInput,
    clearKeyword,
    status,
    setStatus,
    sortLabel,
    openSortModal,
    openFilterModal,
    invoices,
    total,
    isLoading,
    isError,
    isRefetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = useInvoiceList();

  const openDetail = useCallback(
    (invoice: Invoice) => navigation.navigate('InvoiceDetail', { invoice }),
    [navigation],
  );

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const confirmSignOut = useCallback(() => {
    openModal({
      type: 'confirm',
      title: 'Sign out',
      message: 'Are you sure you want to sign out?',
      confirmLabel: 'Sign out',
      onConfirm: signOut,
    });
  }, [openModal, signOut]);

  return (
    <Screen>
      <Box
        row
        align="center"
        justify="space-between"
        style={{ paddingVertical: spacing.md }}
      >
        <AppText variant="title">Invoices</AppText>
        <Box row gap="sm">
          <IconButton glyph="☰" label="Filter by date" onPress={openFilterModal} />
          <IconButton glyph="⇅" label="Sort" onPress={openSortModal} />
          <IconButton glyph="⏻" label="Sign out" onPress={confirmSignOut} />
        </Box>
      </Box>

      <Box gap="sm" style={{ paddingBottom: spacing.sm }}>
        <InvoiceSearchBar
          value={keywordInput}
          onChange={setKeywordInput}
          onClear={clearKeyword}
        />
        <InvoiceStatusChips value={status} onChange={setStatus} />
      </Box>

      <Box
        row
        align="center"
        justify="space-between"
        style={{ paddingVertical: spacing.sm }}
      >
        <AppText variant="caption" color={colors.textMuted}>
          {isLoading ? '—' : `${total} invoice${total === 1 ? '' : 's'}`}
        </AppText>
        <Pressable onPress={openSortModal} hitSlop={8} accessibilityRole="button">
          <AppText
            variant="caption"
            color={colors.primary}
            style={{ fontWeight: '500' }}
          >
            {sortLabel}
          </AppText>
        </Pressable>
      </Box>

      {isError && invoices.length > 0 ? (
        <Box style={{ paddingBottom: spacing.sm }}>
          <ErrorBanner
            message="Could not refresh the list — showing loaded invoices."
            onRetry={refetch}
          />
        </Box>
      ) : null}

      <FlatList
        data={invoices}
        keyExtractor={invoice => invoice.invoiceId}
        renderItem={({ item }) => (
          <InvoiceCard invoice={item} onPress={openDetail} />
        )}
        contentContainerStyle={{ gap: spacing.sm, paddingBottom: 96, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={<ListEmpty />}
        ListFooterComponent={<ListFooter />}
      />

      <Pressable
        onPress={() => navigation.navigate('CreateInvoice')}
        accessibilityRole="button"
        accessibilityLabel="Create invoice"
        style={({ pressed }) => ({
          position: 'absolute',
          right: spacing.lg,
          bottom: spacing.xl,
          width: 52,
          height: 52,
          borderRadius: 26,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? colors.primaryPressed : colors.primary,
          elevation: 6,
          shadowColor: colors.primary,
          shadowOpacity: 0.4,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        })}
      >
        <AppText color={colors.onPrimary} style={{ fontSize: 26, lineHeight: 30 }}>
          +
        </AppText>
      </Pressable>
    </Screen>
  );
}

export function InvoiceListScreen() {
  return (
    <InvoiceListProvider>
      <InvoiceListContent />
    </InvoiceListProvider>
  );
}
