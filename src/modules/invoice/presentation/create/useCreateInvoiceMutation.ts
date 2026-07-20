import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createInvoice } from '../../data/invoiceService';
import type { InvoiceDraft } from '../../domain/schemas';
import { invoiceKeys } from '../queryKeys';

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
