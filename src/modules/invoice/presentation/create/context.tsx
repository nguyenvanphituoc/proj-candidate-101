import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  FieldErrors,
  FieldPath,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  buildCreateInvoicePayload,
  CreateInvoicePayload,
} from '../../data/invoiceMapper';
import { InvoiceDraft, InvoiceDraftSchema } from '../../domain/schemas';
import { invoiceDraftDefaultValues } from './form';

// ─── Steps ────────────────────────────────────────────────────────────────────

export const FORM_STEPS = [
  { title: 'Customer', hint: 'Who this invoice is billed to.' },
  { title: 'Invoice details', hint: 'Reference, currency and dates.' },
  { title: 'Line item', hint: 'Each invoice contains a single line item.' },
  {
    title: 'Payment & adjustments',
    hint: 'Bank account to be paid into, plus tax / discount.',
  },
  { title: 'Review & confirm', hint: 'Check everything before submitting.' },
] as const;

export const TOTAL_STEPS = FORM_STEPS.length;

type FieldName = FieldPath<InvoiceDraft>;

/** Fields validated when leaving each step (review validates everything). */
const STEP_FIELDS: Record<number, FieldName[]> = {
  1: [
    'firstName',
    'lastName',
    'email',
    'mobileNumber',
    'premise',
    'city',
    'county',
    'postcode',
    'countryCode',
  ],
  2: [
    'invoiceNumber',
    'invoiceReference',
    'description',
    'currency',
    'invoiceDate',
    'dueDate',
  ],
  3: ['itemName', 'itemReference', 'itemDescription', 'quantity', 'rate', 'itemUOM'],
  4: ['accountName', 'sortCode', 'accountNumber', 'taxPercent', 'discountFixed'],
};

function firstStepWithError(errors: FieldErrors<InvoiceDraft>): number | undefined {
  for (let step = 1; step <= 4; step++) {
    if (STEP_FIELDS[step].some(field => field in errors)) return step;
  }
  return undefined;
}

// ─── Context ──────────────────────────────────────────────────────────────────

type SubmissionStatus = 'editing' | 'submitting' | 'success';

interface CreateInvoiceFlowContextValue {
  form: UseFormReturn<InvoiceDraft>;
  /** 1-based wizard position. */
  step: number;
  status: SubmissionStatus;
  isFirstStep: boolean;
  isLastStep: boolean;
  /** Validates the current step's fields; advances, or submits from review. */
  goNext: () => Promise<void>;
  goBack: () => void;
  /** Jump directly (review "Edit" links). */
  goToStep: (step: number) => void;
}

const CreateInvoiceFlowContext = createContext<
  CreateInvoiceFlowContextValue | undefined
>(undefined);

interface CreateInvoiceFormProviderProps {
  children: React.ReactNode;
  /**
   * Submission hook point — the create-invoice mutation
   * (useCreateInvoiceMutation, TECH_SPEC §4) plugs in here. Defaults to a
   * no-op so the flow is demoable before the data layer lands.
   */
  onSubmit?: (payload: CreateInvoicePayload) => Promise<void>;
}

export function CreateInvoiceFormProvider({
  children,
  onSubmit,
}: CreateInvoiceFormProviderProps) {
  const form = useForm<InvoiceDraft>({
    resolver: zodResolver(InvoiceDraftSchema),
    defaultValues: invoiceDraftDefaultValues,
    mode: 'onTouched',
  });

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<SubmissionStatus>('editing');

  const goBack = useCallback(() => {
    setStep(prev => Math.max(1, prev - 1));
  }, []);

  const goToStep = useCallback((target: number) => {
    setStep(Math.min(Math.max(target, 1), TOTAL_STEPS));
  }, []);

  const submit = useCallback(async () => {
    await form.handleSubmit(
      async values => {
        setStatus('submitting');
        try {
          await onSubmit?.(buildCreateInvoicePayload(values));
          setStatus('success');
        } catch {
          setStatus('editing');
          form.setError('root', {
            message: 'Could not create the invoice. Please try again.',
          });
        }
      },
      errors => {
        // Shouldn't happen (each step gates on its own validation), but if a
        // stale value slipped through, send the user to the offending step.
        const target = firstStepWithError(errors);
        if (target) setStep(target);
      },
    )();
  }, [form, onSubmit]);

  const goNext = useCallback(async () => {
    if (step >= TOTAL_STEPS) {
      await submit();
      return;
    }
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (valid) setStep(step + 1);
  }, [form, step, submit]);

  const value = useMemo<CreateInvoiceFlowContextValue>(
    () => ({
      form,
      step,
      status,
      isFirstStep: step === 1,
      isLastStep: step === TOTAL_STEPS,
      goNext,
      goBack,
      goToStep,
    }),
    [form, step, status, goNext, goBack, goToStep],
  );

  return (
    <CreateInvoiceFlowContext.Provider value={value}>
      {children}
    </CreateInvoiceFlowContext.Provider>
  );
}

export function useCreateInvoiceFlow(): CreateInvoiceFlowContextValue {
  const context = useContext(CreateInvoiceFlowContext);
  if (!context) {
    throw new Error(
      'useCreateInvoiceFlow must be used within <CreateInvoiceFormProvider>',
    );
  }
  return context;
}
