import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type {
  InvoiceDateFilterValue,
  InvoiceSortValue,
} from '@core/ui';
import { useRootModal } from '@core/ui';
import { useDebouncedValue } from '@core/utils/useDebouncedValue';

import type {
  Invoice,
  InvoiceListFilters,
  InvoiceOrdering,
  InvoiceSortBy,
  InvoiceStatus,
} from '../../domain/schemas/invoice';
import { defaultInvoiceListFilters } from '../../domain/schemas/invoice';
import { useInvoicesQuery } from './useInvoicesQuery';

const KEYWORD_DEBOUNCE_MS = 300;

// ─── Modal value ↔ domain query mapping ───────────────────────────────────────

const SORT_FIELD_TO_DOMAIN: Record<InvoiceSortValue['field'], InvoiceSortBy> = {
  createdDate: 'CREATED_DATE',
  dueDate: 'DUE_DATE',
  amount: 'AMOUNT',
};
const SORT_FIELD_LABELS: Record<InvoiceSortValue['field'], string> = {
  createdDate: 'Created date',
  dueDate: 'Due date',
  amount: 'Amount',
};

function toDomainSort(sort: InvoiceSortValue): {
  sortBy: InvoiceSortBy;
  ordering: InvoiceOrdering;
} {
  return {
    sortBy: SORT_FIELD_TO_DOMAIN[sort.field],
    ordering: sort.direction === 'asc' ? 'ASCENDING' : 'DESCENDING',
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface InvoiceListContextValue {
  // Toolbar state
  keywordInput: string;
  setKeywordInput: (value: string) => void;
  clearKeyword: () => void;
  status: InvoiceStatus | '';
  setStatus: (status: InvoiceStatus | '') => void;
  /** e.g. "Created date ↓" — mirrors the active sort in the meta row. */
  sortLabel: string;
  /** True when any filter beyond the defaults narrows the list. */
  hasActiveFilters: boolean;
  openSortModal: () => void;
  openFilterModal: () => void;

  // Server state (flattened from useInfiniteQuery)
  invoices: Invoice[];
  total: number;
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

const InvoiceListContext = createContext<InvoiceListContextValue | undefined>(
  undefined,
);

export function InvoiceListProvider({ children }: { children: React.ReactNode }) {
  const { openModal } = useRootModal();

  const [keywordInput, setKeywordInput] = useState('');
  const [status, setStatus] = useState<InvoiceStatus | ''>('');
  const [sort, setSort] = useState<InvoiceSortValue>({
    field: 'createdDate',
    direction: 'desc',
  });
  const [dateRange, setDateRange] = useState<InvoiceDateFilterValue>({
    fromDate: null,
    toDate: null,
  });

  const keyword = useDebouncedValue(keywordInput.trim(), KEYWORD_DEBOUNCE_MS);

  const filters = useMemo<InvoiceListFilters>(
    () => ({
      keyword,
      status,
      ...toDomainSort(sort),
      fromDate: dateRange.fromDate ?? '',
      toDate: dateRange.toDate ?? '',
    }),
    [keyword, status, sort, dateRange],
  );

  const query = useInvoicesQuery(filters);

  const openSortModal = useCallback(() => {
    openModal({ type: 'invoice-sort', initialValue: sort, onApply: setSort });
  }, [openModal, sort]);

  const openFilterModal = useCallback(() => {
    openModal({
      type: 'invoice-filter',
      initialValue: dateRange,
      onApply: setDateRange,
    });
  }, [openModal, dateRange]);

  const clearKeyword = useCallback(() => setKeywordInput(''), []);

  const invoices = useMemo(
    () => query.data?.pages.flatMap(page => page.data) ?? [],
    [query.data],
  );
  const total = query.data?.pages.at(-1)?.total ?? 0;

  const value = useMemo<InvoiceListContextValue>(
    () => ({
      keywordInput,
      setKeywordInput,
      clearKeyword,
      status,
      setStatus,
      sortLabel: `${SORT_FIELD_LABELS[sort.field]} ${
        sort.direction === 'asc' ? '↑' : '↓'
      }`,
      hasActiveFilters:
        keyword !== defaultInvoiceListFilters.keyword ||
        status !== defaultInvoiceListFilters.status ||
        dateRange.fromDate !== null ||
        dateRange.toDate !== null,
      openSortModal,
      openFilterModal,
      invoices,
      total,
      isLoading: query.isLoading,
      isError: query.isError,
      isRefetching: query.isRefetching && !query.isFetchingNextPage,
      isFetchingNextPage: query.isFetchingNextPage,
      hasNextPage: query.hasNextPage ?? false,
      fetchNextPage: query.fetchNextPage,
      refetch: query.refetch,
    }),
    [
      keywordInput,
      clearKeyword,
      status,
      sort,
      keyword,
      dateRange,
      openSortModal,
      openFilterModal,
      invoices,
      total,
      query.isLoading,
      query.isError,
      query.isRefetching,
      query.isFetchingNextPage,
      query.hasNextPage,
      query.fetchNextPage,
      query.refetch,
    ],
  );

  return (
    <InvoiceListContext.Provider value={value}>
      {children}
    </InvoiceListContext.Provider>
  );
}

export function useInvoiceList(): InvoiceListContextValue {
  const context = useContext(InvoiceListContext);
  if (!context) {
    throw new Error('useInvoiceList must be used within <InvoiceListProvider>');
  }
  return context;
}
