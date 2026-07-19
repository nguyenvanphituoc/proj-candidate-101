import { z } from 'zod';

/**
 * InvoiceDraft — everything the user provides to create an invoice
 * (TECH_SPEC §4: domain/schemas). One declaration = validation rules +
 * inferred TS type; forms consume it via zodResolver, tests directly.
 *
 * Domain rule: this file imports nothing from React Native or core/ui —
 * selected options are modeled here as plain {id, label} pairs (structurally
 * compatible with the UI kit's SelectionValue).
 */

export const SelectionOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
});
export type SelectionOption = z.infer<typeof SelectionOptionSchema>;

const requiredString = (message: string) => z.string().trim().min(1, message);

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(value: string): boolean {
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

/** Dates are YYYY-MM-DD strings throughout the domain (docs/domain.md). */
const dateString = (requiredMessage: string) =>
  z
    .string()
    .min(1, requiredMessage)
    .regex(DATE_RE, 'Use the format YYYY-MM-DD')
    .refine(v => !DATE_RE.test(v) || isRealDate(v), 'Enter a valid calendar date');

const positiveNumberString = (message: string) =>
  z
    .string()
    .min(1, message)
    .refine(v => Number.isFinite(Number(v)) && Number(v) > 0, message);

/** Optional numeric field — empty string means "not set". */
const optionalAmountString = z
  .string()
  .refine(
    v => v === '' || (Number.isFinite(Number(v)) && Number(v) >= 0),
    'Enter a valid amount',
  );

// ─── Draft sections (also drive per-step validation in the create wizard) ─────

export const customerSchema = z.object({
  firstName: requiredString('First name is required'),
  lastName: requiredString('Last name is required'),
  email: z.email('Enter a valid email address'),
  mobileNumber: requiredString('Mobile number is required'),
  premise: requiredString('Premise is required'),
  city: requiredString('City is required'),
  county: requiredString('County is required'),
  postcode: requiredString('Postcode is required'),
  countryCode: z.array(SelectionOptionSchema).min(1, 'Country is required'),
});

export const invoiceDetailsSchema = z.object({
  invoiceNumber: requiredString('Invoice number is required'),
  invoiceReference: requiredString('Invoice reference is required'),
  description: z.string(),
  currency: z.array(SelectionOptionSchema).min(1, 'Currency is required'),
  invoiceDate: dateString('Invoice date is required'),
  dueDate: dateString('Due date is required'),
});

/** Single line item per invoice — app rule (docs/domain.md). */
export const lineItemSchema = z.object({
  itemName: requiredString('Item name is required'),
  itemReference: requiredString('Item reference is required'),
  itemDescription: z.string(),
  quantity: positiveNumberString('Enter a quantity greater than 0'),
  rate: positiveNumberString('Enter a rate greater than 0'),
  itemUOM: z.array(SelectionOptionSchema).min(1, 'Unit is required'),
});

export const paymentSchema = z.object({
  accountName: requiredString('Account name is required'),
  sortCode: requiredString('Sort code is required'),
  accountNumber: requiredString('Account number is required'),
  taxPercent: optionalAmountString,
  discountFixed: optionalAmountString,
});

// ─── Full draft ───────────────────────────────────────────────────────────────

export const InvoiceDraftSchema = z
  .object({
    ...customerSchema.shape,
    ...invoiceDetailsSchema.shape,
    ...lineItemSchema.shape,
    ...paymentSchema.shape,
  })
  .superRefine((values, ctx) => {
    if (
      DATE_RE.test(values.invoiceDate) &&
      DATE_RE.test(values.dueDate) &&
      values.dueDate < values.invoiceDate
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['dueDate'],
        message: 'Due date must be on or after the invoice date',
      });
    }
  });

export type InvoiceDraft = z.infer<typeof InvoiceDraftSchema>;
