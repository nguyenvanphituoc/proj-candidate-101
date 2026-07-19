import { useInfiniteQuery } from '@tanstack/react-query';

import { invoiceRepository } from '../../data/InvoiceRepositoryMock';
import type { InvoiceListFilters } from '../../domain/schemas/invoice';
import { makeGetInvoicesUseCase } from '../../domain/usecases/getInvoices';
import { invoiceKeys } from '../queryKeys';

export const PAGE_SIZE = 10;

// Wired at import until app/di.ts lands (TECH_SPEC §4) — the only line that
// changes when InvoiceRepositoryImpl replaces the mock.
const getInvoices = makeGetInvoicesUseCase(invoiceRepository);

/**
 * Infinite invoice list (TECH_SPEC §2.4): filters in the query key,
 * pageNum through pageParam.
 */
export function useInvoicesQuery(filters: InvoiceListFilters) {
  return useInfiniteQuery({
    queryKey: invoiceKeys.list(filters),
    queryFn: ({ pageParam }) =>
      getInvoices({ ...filters, pageNum: pageParam, pageSize: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.hasMore ? lastPage.pageNum + 1 : undefined,
  });
}
