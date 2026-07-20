import { z } from 'zod';

/**
 * Raw API shapes for the invoice module (TECH_SPEC §4 data layer). The exact
 * response envelope is an open item (TECH_SPEC §6 / docs/domain.md), so these
 * schemas are deliberately tolerant — unknown fields pass through
 * (`looseObject`), absent/null fields (`nullish`) default in the mapper, and
 * the list/create envelopes accept the couple of shapes a REST list/create
 * endpoint plausibly returns. Domain never sees these shapes; `invoiceMapper`
 * converts them.
 */

const InvoiceItemDtoSchema = z.looseObject({
  itemReference: z.string().nullish(),
  itemName: z.string().nullish(),
  description: z.string().nullish(),
  quantity: z.number().nullish(),
  rate: z.number().nullish(),
  itemUOM: z.string().nullish(),
});

const InvoiceCustomerDtoSchema = z.looseObject({
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
});

/** Sandbox has been observed sending both a bare string and a status-history
 *  array (e.g. `[{ status: "PAID", ... }]`) for the same field — accept
 *  either shape here and let `normalizeStatus` pick the effective value. */
const InvoiceStatusEntryDtoSchema = z.union([
  z.string(),
  z.looseObject({
    status: z.string().nullish(),
    name: z.string().nullish(),
  }),
]);

/** One invoice as returned by the invoice-service (list rows and the created
 *  invoice both use this shape). */
export const InvoiceRecordDtoSchema = z.looseObject({
  invoiceId: z.string().nullish(),
  id: z.string().nullish(),
  invoiceNumber: z.string(),
  invoiceReference: z.string().nullish(),
  customer: InvoiceCustomerDtoSchema.nullish(),
  status: z.union([z.string(), z.array(InvoiceStatusEntryDtoSchema)]).nullish(),
  currency: z.string().nullish(),
  totalAmount: z.number().nullish(),
  total: z.number().nullish(),
  createdDate: z.string().nullish(),
  createdAt: z.string().nullish(),
  dueDate: z.string().nullish(),
  description: z.string().nullish(),
  items: z.array(InvoiceItemDtoSchema).nullish(),
});
export type InvoiceRecordDto = z.infer<typeof InvoiceRecordDtoSchema>;

const InvoiceListEnvelopeSchema = z.looseObject({
  data: z.array(InvoiceRecordDtoSchema),
  pageNum: z.number().nullish(),
  page: z.number().nullish(),
  pageSize: z.number().nullish(),
  total: z.number().nullish(),
  totalRecords: z.number().nullish(),
  hasMore: z.boolean().nullish(),
});

/**
 * GET /invoice-service/1.0.0/invoices — accepts either an enveloped
 * `{ data: [...], pageNum, total, ... }` response or a bare array, and
 * normalizes both to the envelope shape.
 */
export const GetInvoicesResponseDtoSchema = z.union([
  InvoiceListEnvelopeSchema,
  z.array(InvoiceRecordDtoSchema).transform(data => ({
    data,
    pageNum: undefined,
    page: undefined,
    pageSize: undefined,
    total: undefined,
    totalRecords: undefined,
    hasMore: undefined,
  })),
]);
export type GetInvoicesResponseDto = z.infer<typeof GetInvoicesResponseDtoSchema>;

const CreateInvoiceEnvelopeSchema = z.looseObject({
  invoices: z.array(InvoiceRecordDtoSchema).nullish(),
  data: z.array(InvoiceRecordDtoSchema).nullish(),
});

/**
 * POST /invoice-service/1.0.0/invoices — request body is `{ invoices: [...] }`
 * (invoiceMapper.buildCreateInvoicePayload), so the response most plausibly
 * mirrors that; also tolerates a `{ data: [...] }` envelope or a bare record.
 * Normalizes to the single created record.
 */
export const CreateInvoiceResponseDtoSchema = z.union([
  InvoiceRecordDtoSchema,
  CreateInvoiceEnvelopeSchema.transform(
    env => env.invoices?.[0] ?? env.data?.[0],
  ),
]);
export type CreateInvoiceResponseDto = z.infer<
  typeof CreateInvoiceResponseDtoSchema
>;
