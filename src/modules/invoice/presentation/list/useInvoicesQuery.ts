import { useInfiniteQuery } from '@tanstack/react-query';

import { getInvoices } from '../../data/invoiceService';
import type { InvoiceListFilters } from '../../domain/schemas/invoice';
import { invoiceKeys } from '../queryKeys';

export const PAGE_SIZE = 10;

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
