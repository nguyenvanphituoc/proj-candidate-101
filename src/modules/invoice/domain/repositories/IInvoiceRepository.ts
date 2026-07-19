import type { InvoiceDraft } from '../schemas';
import type {
  Invoice,
  InvoiceListPage,
  InvoiceQuery,
} from '../schemas/invoice';

/** Data-layer contract for the invoice module (TECH_SPEC §4). */
export interface IInvoiceRepository {
  getInvoices(query: InvoiceQuery): Promise<InvoiceListPage>;
  /** Rejects with a user-safe message on server validation (e.g. duplicate
   *  invoice number) — UC-06 error path. */
  createInvoice(draft: InvoiceDraft): Promise<Invoice>;
}
