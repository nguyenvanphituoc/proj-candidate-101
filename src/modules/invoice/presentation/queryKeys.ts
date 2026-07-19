import type { InvoiceListFilters } from '../domain/schemas/invoice';

/**
 * Module-owned query keys (TECH_SPEC §4). Filters live inside the key so
 * every filter/sort/keyword combination is its own cache entry and changes
 * refetch without manual effects; pageNum stays out (pageParam).
 */
export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (filters: InvoiceListFilters) => [...invoiceKeys.lists(), filters] as const,
};
