import type { InvoiceListPage, InvoiceQuery } from '../schemas/invoice';

/** Data-layer contract for the invoice module (TECH_SPEC §4). */
export interface IInvoiceRepository {
  getInvoices(query: InvoiceQuery): Promise<InvoiceListPage>;
}
