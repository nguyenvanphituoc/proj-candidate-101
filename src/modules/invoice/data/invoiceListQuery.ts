import type {
  Invoice,
  InvoiceListPage,
  InvoiceQuery,
} from '../domain/schemas/invoice';

/**
 * Server-side behaviour of the Fetch Invoices API — keyword/status/date
 * filtering, sorting, and pagination over a full dataset
 * (docs/invoice-list-flow.html). Used by the mock repository and kept as the
 * reference for `getNextPageParam` once the real envelope is captured
 * (TECH_SPEC §6).
 */
export function queryInvoices(
  all: Invoice[],
  query: InvoiceQuery,
): InvoiceListPage {
  let rows = all;

  if (query.keyword) {
    const keyword = query.keyword.toLowerCase();
    rows = rows.filter(r => r.invoiceNumber.toLowerCase().includes(keyword));
  }
  if (query.status) {
    rows = rows.filter(r => r.status === query.status);
  }
  if (query.fromDate) {
    rows = rows.filter(r => r.createdDate >= query.fromDate);
  }
  if (query.toDate) {
    rows = rows.filter(r => r.createdDate <= query.toDate);
  }

  rows = [...rows].sort((a, b) => {
    let cmp = 0;
    if (query.sortBy === 'CREATED_DATE') {
      cmp = a.createdDate.localeCompare(b.createdDate);
    } else if (query.sortBy === 'DUE_DATE') {
      cmp = a.dueDate.localeCompare(b.dueDate);
    } else {
      cmp = a.totalAmount - b.totalAmount;
    }
    return query.ordering === 'ASCENDING' ? cmp : -cmp;
  });

  const start = (query.pageNum - 1) * query.pageSize;
  const data = rows.slice(start, start + query.pageSize);

  return {
    data,
    total: rows.length,
    pageNum: query.pageNum,
    hasMore: start + data.length < rows.length,
  };
}
