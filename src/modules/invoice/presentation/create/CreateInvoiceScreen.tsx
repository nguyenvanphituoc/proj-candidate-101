import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  AppButton,
  AppText,
  Box,
  colors,
  ErrorBanner,
  Screen,
  spacing,
} from '@core/ui';

import {
  CreateInvoiceFormProvider,
  FORM_STEPS,
  TOTAL_STEPS,
  useCreateInvoiceFlow,
} from './context';
import { Stepper } from './components/Stepper';
import { CustomerStep } from './steps/CustomerStep';
import { InvoiceDetailsStep } from './steps/InvoiceDetailsStep';
import { LineItemStep } from './steps/LineItemStep';
import { PaymentStep } from './steps/PaymentStep';
import { ReviewStep } from './steps/ReviewStep';

/**
 * 5-step create-invoice wizard (docs/create-invoice-flow.html):
 * Customer → Invoice details → Line item → Payment & adjustments → Review.
 * Step state + per-step validation live in CreateInvoiceFormProvider.
 */
export function CreateInvoiceScreen() {
  return (
    <CreateInvoiceFormProvider>
      <CreateInvoiceWizard />
    </CreateInvoiceFormProvider>
  );
}

function StepBody({ step }: { step: number }) {
  switch (step) {
    case 1:
      return <CustomerStep />;
    case 2:
      return <InvoiceDetailsStep />;
    case 3:
      return <LineItemStep />;
    case 4:
      return <PaymentStep />;
    case 5:
      return <ReviewStep />;
    default:
      return null;
  }
}

function CreateInvoiceWizard() {
  const navigation = useNavigation();
  const { form, step, status, isFirstStep, isLastStep, goNext, goBack } =
    useCreateInvoiceFlow();

  if (status === 'success') {
    return <SuccessView invoiceNumber={form.getValues('invoiceNumber')} />;
  }

  const meta = FORM_STEPS[step - 1];
  const rootError = form.formState.errors.root?.message;

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <Box row align="center" gap="sm" style={{ paddingVertical: spacing.sm }}>
          <Pressable
            onPress={() => (isFirstStep ? navigation.goBack() : goBack())}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <AppText variant="subtitle">←</AppText>
          </Pressable>
          <AppText variant="subtitle">Create invoice</AppText>
        </Box>

        <Stepper step={step} total={TOTAL_STEPS} label={meta.title} />

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: spacing.md, gap: spacing.md }}
        >
          <Box gap="xs">
            <AppText variant="subtitle">{meta.title}</AppText>
            <AppText variant="caption" color={colors.textMuted}>
              {meta.hint}
            </AppText>
          </Box>
          {rootError ? <ErrorBanner message={rootError} /> : null}
          <StepBody step={step} />
        </ScrollView>

        {/* Footer nav */}
        <Box row gap="sm" style={{ paddingVertical: spacing.sm }}>
          {!isFirstStep && (
            <Box flex={1}>
              <AppButton title="Back" variant="secondary" onPress={goBack} />
            </Box>
          )}
          <Box flex={1}>
            <AppButton
              title={isLastStep ? 'Create invoice' : 'Next'}
              loading={status === 'submitting'}
              onPress={goNext}
            />
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function SuccessView({ invoiceNumber }: { invoiceNumber: string }) {
  const navigation = useNavigation();

  return (
    <Screen>
      <Box flex={1} align="center" justify="center" gap="md">
        <Box
          align="center"
          justify="center"
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#ECFDF3',
          }}
        >
          <AppText variant="title" color={colors.success}>
            ✓
          </AppText>
        </Box>
        <AppText variant="subtitle">Invoice created</AppText>
        <AppText
          variant="caption"
          color={colors.textMuted}
          style={{ textAlign: 'center' }}
        >
          Invoice {invoiceNumber} has been created successfully.
        </AppText>
        <Box style={{ alignSelf: 'stretch', paddingTop: spacing.md }}>
          <AppButton
            title="Back to invoice list"
            onPress={() => navigation.goBack()}
          />
        </Box>
      </Box>
    </Screen>
  );
}
