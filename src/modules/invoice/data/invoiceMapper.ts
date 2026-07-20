import type { InvoiceDraft } from '../domain/schemas';
import type { Invoice, InvoiceStatus } from '../domain/schemas/invoice';
import { InvoiceSchema } from '../domain/schemas/invoice';
import type { InvoiceRecordDto } from './invoiceDtos';

/**
 * Maps an InvoiceDraft to the invoice-service request body
 * (POST /invoice-service/1.0.0/invoices) — TECH_SPEC §4 data layer.
 * Adjustments are what the API calls "extensions" (docs/domain.md).
 */
export function buildCreateInvoicePayload(draft: InvoiceDraft) {
  const extensions: Array<{
    addDeduct: 'ADD' | 'DEDUCT';
    type: 'PERCENTAGE' | 'FIXED_VALUE';
    value: number;
    name: string;
  }> = [];

  if (draft.taxPercent !== '') {
    extensions.push({
      addDeduct: 'ADD',
      type: 'PERCENTAGE',
      value: Number(draft.taxPercent),
      name: 'tax',
    });
  }
  if (draft.discountFixed !== '') {
    extensions.push({
      addDeduct: 'DEDUCT',
      type: 'FIXED_VALUE',
      value: Number(draft.discountFixed),
      name: 'discount',
    });
  }

  return {
    invoices: [
      {
        bankAccount: {
          bankId: '',
          sortCode: draft.sortCode.trim(),
          accountNumber: draft.accountNumber.trim(),
          accountName: draft.accountName.trim(),
        },
        customer: {
          firstName: draft.firstName.trim(),
          lastName: draft.lastName.trim(),
          contact: {
            email: draft.email.trim(),
            mobileNumber: draft.mobileNumber.trim(),
          },
          addresses: [
            {
              premise: draft.premise.trim(),
              countryCode: draft.countryCode[0]?.id ?? '',
              postcode: draft.postcode.trim(),
              county: draft.county.trim(),
              city: draft.city.trim(),
              addressType: 'BILLING' as const,
            },
          ],
        },
        invoiceReference: draft.invoiceReference.trim(),
        invoiceNumber: draft.invoiceNumber.trim(),
        currency: draft.currency[0]?.id ?? '',
        invoiceDate: draft.invoiceDate,
        dueDate: draft.dueDate,
        description: draft.description.trim(),
        extensions,
        items: [
          {
            itemReference: draft.itemReference.trim(),
            description: draft.itemDescription.trim(),
            quantity: Number(draft.quantity),
            rate: Number(draft.rate),
            itemName: draft.itemName.trim(),
            itemUOM: draft.itemUOM[0]?.id ?? '',
          },
        ],
      },
    ],
  };
}

export type CreateInvoicePayload = ReturnType<typeof buildCreateInvoicePayload>;

/** Server status values aren't documented yet (TECH_SPEC §6) — matched
 *  case-insensitively, unrecognized values fall back to 'Pending'. Also seen
 *  as a status-history array (e.g. `[{ status: "PAID" }]`); the last entry
 *  is taken as the current status. */
function normalizeStatus(status: InvoiceRecordDto['status']): InvoiceStatus {
  const raw = Array.isArray(status)
    ? (() => {
        const last = status[status.length - 1];
        return typeof last === 'string' ? last : last?.status ?? last?.name;
      })()
    : status;

  const normalized = (raw ?? '').trim().toLowerCase();
  if (normalized === 'paid') return 'Paid';
  if (normalized === 'overdue') return 'Overdue';
  return 'Pending';
}

/**
 * Maps an invoice-service record (list row or the just-created invoice) to
 * the flat domain Invoice — the inverse of buildCreateInvoicePayload's
 * nesting (TECH_SPEC §4 data layer).
 */
export function mapInvoiceRecord(dto: InvoiceRecordDto): Invoice {
  const item = dto.items?.[0];
  const customerName = [dto.customer?.firstName, dto.customer?.lastName]
    .filter(Boolean)
    .join(' ');

  return InvoiceSchema.parse({
    invoiceId: dto.invoiceId ?? dto.id ?? dto.invoiceNumber,
    invoiceNumber: dto.invoiceNumber,
    invoiceReference: dto.invoiceReference ?? '',
    customerName,
    status: normalizeStatus(dto.status),
    currency: dto.currency ?? '',
    totalAmount: dto.totalAmount ?? dto.total ?? 0,
    createdDate: dto.createdDate ?? dto.createdAt ?? '',
    dueDate: dto.dueDate ?? '',
    description: dto.description ?? '',
    itemName: item?.itemName ?? '',
    quantity: item?.quantity ?? 0,
    rate: item?.rate ?? 0,
  });
}
