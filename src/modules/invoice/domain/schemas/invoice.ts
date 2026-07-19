import { z } from 'zod';

/**
 * Invoice list domain — entity, query params, and page shape
 * (docs/domain.md: Invoice, InvoiceQuery, InvoiceListPage).
 *
 * Domain rule: no React Native / fetch / TanStack imports here.
 */

export const INVOICE_STATUSES = ['Paid', 'Pending', 'Overdue'] as const;
export const InvoiceStatusSchema = z.enum(INVOICE_STATUSES);
export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;

/**
 * Invoice as returned by the Fetch Invoices API — flattened summary used by
 * the list and detail screens. `safeParse`d at the DTO boundary.
 */
export const InvoiceSchema = z.object({
  invoiceId: z.string(),
  invoiceNumber: z.string(),
  invoiceReference: z.string(),
  customerName: z.string(),
  status: InvoiceStatusSchema,
  currency: z.string(),
  totalAmount: z.number(),
  /** YYYY-MM-DD strings throughout the domain (docs/domain.md). */
  createdDate: z.string(),
  dueDate: z.string(),
  description: z.string(),
  itemName: z.string(),
  quantity: z.number(),
  rate: z.number(),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

export type InvoiceSortBy = 'CREATED_DATE' | 'DUE_DATE' | 'AMOUNT';
export type InvoiceOrdering = 'ASCENDING' | 'DESCENDING';

/** Mirrors the Fetch Invoices API params (keyword, status, dates, sort, page). */
export interface InvoiceQuery {
  keyword: string;
  /** Empty string = all statuses. */
  status: InvoiceStatus | '';
  sortBy: InvoiceSortBy;
  ordering: InvoiceOrdering;
  /** YYYY-MM-DD bounds on createdDate; empty string = unbounded. */
  fromDate: string;
  toDate: string;
  /** 1-based. */
  pageNum: number;
  pageSize: number;
}

/** The filter/sort half of InvoiceQuery — what the list screen's state owns.
 *  pageNum/pageSize stay out (they flow through useInfiniteQuery's pageParam). */
export type InvoiceListFilters = Omit<InvoiceQuery, 'pageNum' | 'pageSize'>;

export const defaultInvoiceListFilters: InvoiceListFilters = {
  keyword: '',
  status: '',
  sortBy: 'CREATED_DATE',
  ordering: 'DESCENDING',
  fromDate: '',
  toDate: '',
};

export interface InvoiceListPage {
  data: Invoice[];
  total: number;
  pageNum: number;
  hasMore: boolean;
}
