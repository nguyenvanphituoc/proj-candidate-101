import type { IInvoiceRepository } from '../repositories/IInvoiceRepository';
import type { InvoiceListPage, InvoiceQuery } from '../schemas/invoice';

export type GetInvoicesUseCase = (
  query: InvoiceQuery,
) => Promise<InvoiceListPage>;

/**
 * Presentation never touches the repository directly (TECH_SPEC §4 flow:
 * hook → use case → IRepository). Business rules that outgrow the server
 * (e.g. client-side status derivation) land here.
 */
export function makeGetInvoicesUseCase(
  repository: IInvoiceRepository,
): GetInvoicesUseCase {
  return query => repository.getInvoices(query);
}
