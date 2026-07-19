import type { InvoiceDraft } from '../domain/schemas';

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
