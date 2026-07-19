import { useMutation, useQueryClient } from '@tanstack/react-query';

import { invoiceRepository } from '../../data/InvoiceRepositoryMock';
import type { InvoiceDraft } from '../../domain/schemas';
import { makeCreateInvoiceUseCase } from '../../domain/usecases/createInvoice';
import { invoiceKeys } from '../queryKeys';

// Wired at import until app/di.ts lands (TECH_SPEC §4) — the only line that
// changes when InvoiceRepositoryImpl replaces the mock.
const createInvoice = makeCreateInvoiceUseCase(invoiceRepository);

/**
 * UC-06: submit the validated draft; on success every cached list entry is
 * invalidated so the invoice list refreshes.
 */
export function useCreateInvoiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draft: InvoiceDraft) => createInvoice(draft),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() }),
  });
}
