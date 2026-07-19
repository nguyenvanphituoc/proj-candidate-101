import type { InvoiceDraft, SelectionOption } from '../../domain/schemas';

/**
 * Presentation-side form setup for the create wizard: initial values and
 * picker options. Validation lives in the domain InvoiceDraftSchema.
 */

export const invoiceDraftDefaultValues: InvoiceDraft = {
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
  premise: '',
  city: '',
  county: '',
  postcode: '',
  countryCode: [],
  invoiceNumber: '',
  invoiceReference: '',
  description: '',
  currency: [],
  invoiceDate: '',
  dueDate: '',
  itemName: '',
  itemReference: '',
  itemDescription: '',
  quantity: '',
  rate: '',
  itemUOM: [{ id: 'KG', label: 'KG' }],
  accountName: '',
  sortCode: '',
  accountNumber: '',
  taxPercent: '',
  discountFixed: '',
};

// Options from the flow mock; replace with API data when available.

export const COUNTRY_OPTIONS: SelectionOption[] = [
  { id: 'VN', label: 'Vietnam (VN)' },
  { id: 'SG', label: 'Singapore (SG)' },
  { id: 'GB', label: 'United Kingdom (GB)' },
];

export const CURRENCY_OPTIONS: SelectionOption[] = [
  { id: 'GBP', label: 'GBP' },
  { id: 'USD', label: 'USD' },
  { id: 'SGD', label: 'SGD' },
  { id: 'VND', label: 'VND' },
];

export const UOM_OPTIONS: SelectionOption[] = [
  { id: 'KG', label: 'KG' },
  { id: 'UNIT', label: 'UNIT' },
  { id: 'HOUR', label: 'HOUR' },
];
