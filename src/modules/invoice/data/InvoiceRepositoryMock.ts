import type { IInvoiceRepository } from '../domain/repositories/IInvoiceRepository';
import type {
  Invoice,
  InvoiceListPage,
  InvoiceQuery,
} from '../domain/schemas/invoice';
import { INVOICE_STATUSES, InvoiceSchema } from '../domain/schemas/invoice';
import { queryInvoices } from './invoiceListQuery';

/**
 * Stand-in for InvoiceRepositoryImpl until core/network + the sandbox
 * invoice-service land (TECH_SPEC §4 / §6). Serves the dataset from
 * docs/invoice-list-flow.html with simulated latency so loading, pagination,
 * and refetch states behave like the real thing. Swapping in the real
 * implementation only replaces this file — same IInvoiceRepository contract.
 */

const NAMES: Array<[string, string]> = [
  ['Nguyen', 'Dung'],
  ['Akila', 'Jayasinghe'],
  ['John', 'Terry'],
  ['Mai', 'Tran'],
  ['Ravi', 'Kumar'],
  ['Sara', 'Lim'],
  ['Duc', 'Pham'],
  ['Wei', 'Chen'],
];

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** 37 invoices spread across June/July 2026 — mirrors the mockup dataset. */
export function buildMockInvoices(): Invoice[] {
  return Array.from({ length: 37 }, (_, i) => {
    const created = new Date(Date.UTC(2026, 5, 28 - i));
    const due = new Date(created);
    due.setUTCDate(due.getUTCDate() + 8);
    const [firstName, lastName] = NAMES[i % NAMES.length];
    return InvoiceSchema.parse({
      invoiceId: `id-${i}`,
      invoiceNumber: `IV16493188${70000 + i * 7}`,
      invoiceReference: `#${123400 + i}`,
      customerName: `${firstName} ${lastName}`,
      status: INVOICE_STATUSES[i % 3],
      currency: 'GBP',
      totalAmount: Math.round((300 + ((i * 137) % 4200)) * 100) / 100,
      createdDate: isoDate(created),
      dueDate: isoDate(due),
      description: `Invoice is issued to ${firstName} ${lastName}`,
      itemName: 'Honda Motor',
      quantity: 1 + (i % 3),
      rate: 1000,
    });
  });
}

const NETWORK_DELAY_MS = 400;

export class InvoiceRepositoryMock implements IInvoiceRepository {
  private readonly all = buildMockInvoices();

  async getInvoices(query: InvoiceQuery): Promise<InvoiceListPage> {
    await new Promise<void>(resolve => setTimeout(() => resolve(), NETWORK_DELAY_MS));
    return queryInvoices(this.all, query);
  }
}

export const invoiceRepository: IInvoiceRepository = new InvoiceRepositoryMock();
