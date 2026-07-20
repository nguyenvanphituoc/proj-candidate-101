import { apiHttpClient } from '@core/network';

import type { IInvoiceRepository } from '../domain/repositories/IInvoiceRepository';
import { makeCreateInvoiceUseCase } from '../domain/usecases/createInvoice';
import { makeGetInvoicesUseCase } from '../domain/usecases/getInvoices';
import { InvoiceRepositoryImpl } from './InvoiceRepositoryImpl';
// import { InvoiceRepositoryMock } from './InvoiceRepositoryMock';

// Wired at import until app/di.ts lands (TECH_SPEC §4) — the only line that
// changes when swapping the mock back in.
const repository: IInvoiceRepository = new InvoiceRepositoryImpl(apiHttpClient);
// const repository: IInvoiceRepository = new InvoiceRepositoryMock();

export const getInvoices = makeGetInvoicesUseCase(repository);
export const createInvoice = makeCreateInvoiceUseCase(repository);
