import type { HttpClient } from '@core/network';
import { ApiError } from '@core/network';

import type { IInvoiceRepository } from '../domain/repositories/IInvoiceRepository';
import type { InvoiceDraft } from '../domain/schemas';
import type {
  Invoice,
  InvoiceListPage,
  InvoiceQuery,
} from '../domain/schemas/invoice';
import {
  CreateInvoiceResponseDtoSchema,
  GetInvoicesResponseDtoSchema,
} from './invoiceDtos';
import { buildCreateInvoicePayload, mapInvoiceRecord } from './invoiceMapper';

/**
 * Real data layer for the invoice module (TECH_SPEC §2.3 / §4): fetch
 * invoices (UC-05) and create invoice (UC-06) against invoice-service. Auth
 * (Bearer + org-token) is attached by the auth module's request interceptor
 * on the shared `apiHttp` client — this file has zero imports from auth
 * (TECH_SPEC §2.2 dependency rule).
 */

const INVOICE_PATH = '/invoice-service/1.0.0/invoices';

const MESSAGES = {
  sessionExpired: 'Session expired — please sign in again.',
  offline: 'Network error — please check your connection and try again.',
  unexpected: 'Something went wrong. Please try again.',
  createFailed: 'Could not create the invoice. Please try again.',
} as const;

/**
 * Collapses an ApiError into a user-safe message. Unlike auth, server
 * validation messages (e.g. duplicate invoice number, UC-06) are surfaced
 * as-is — `ApiError.message` is already extracted from the response body
 * by `apiErrorFromResponse` and is meant to reach the form.
 */
function toUserSafeError(error: unknown, fallback: string): Error {
  if (ApiError.isApiError(error)) {
    if (error.isTransportError) return new Error(MESSAGES.offline);
    if (error.status === 401) return new Error(MESSAGES.sessionExpired);
    if (error.message) return new Error(error.message);
  }
  return new Error(fallback);
}

export class InvoiceRepositoryImpl implements IInvoiceRepository {
  constructor(private readonly apiHttp: HttpClient) {}

  async getInvoices(query: InvoiceQuery): Promise<InvoiceListPage> {
    let raw: unknown;
    try {
      raw = await this.apiHttp.get(INVOICE_PATH, {
        query: {
          sortBy: query.sortBy,
          ordering: query.ordering,
          pageNum: query.pageNum,
          pageSize: query.pageSize,
          keyword: query.keyword || undefined,
          status: query.status || undefined,
          fromDate: query.fromDate || undefined,
          toDate: query.toDate || undefined,
        },
      });
    } catch (error) {
      throw toUserSafeError(error, MESSAGES.unexpected);
    }

    const dto = GetInvoicesResponseDtoSchema.safeParse(raw);
    if (!dto.success) throw new Error(MESSAGES.unexpected);

    const data = dto.data.data.map(mapInvoiceRecord);
    const pageNum = dto.data.pageNum ?? dto.data.page ?? query.pageNum;
    const total = dto.data.total ?? dto.data.totalRecords ?? data.length;
    const hasMore = dto.data.hasMore ?? pageNum * query.pageSize < total;

    return { data, total, pageNum, hasMore };
  }

  async createInvoice(draft: InvoiceDraft): Promise<Invoice> {
    let raw: unknown;
    try {
      raw = await this.apiHttp.post(
        INVOICE_PATH,
        { json: buildCreateInvoicePayload(draft) },
        { headers: { 'Operation-Mode': 'SYNC' } },
      );
    } catch (error) {
      throw toUserSafeError(error, MESSAGES.createFailed);
    }

    const dto = CreateInvoiceResponseDtoSchema.safeParse(raw);
    if (!dto.success || !dto.data) throw new Error(MESSAGES.createFailed);
    return mapInvoiceRecord(dto.data);
  }
}
