import type { IInvoiceRepository } from '../repositories/IInvoiceRepository';
import type { InvoiceDraft } from '../schemas';
import type { Invoice } from '../schemas/invoice';

export type CreateInvoiceUseCase = (draft: InvoiceDraft) => Promise<Invoice>;

/**
 * UC-06 Create Invoice — the single entry point for the flow. The draft is
 * already validated by InvoiceDraftSchema (form side); payload shaping is a
 * data-layer concern (invoiceMapper).
 */
export function makeCreateInvoiceUseCase(
  repository: IInvoiceRepository,
): CreateInvoiceUseCase {
  return draft => repository.createInvoice(draft);
}
