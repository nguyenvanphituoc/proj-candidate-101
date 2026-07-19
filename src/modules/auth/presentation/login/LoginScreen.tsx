import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppButton, AppText, Box, ElementField, ErrorBanner, Screen } from '@core/ui';
import { useAuthSession } from '@/app/providers/AuthSessionProvider';

type LoginFormValues = {
  username: string;
  password: string;
};

export function LoginScreen() {
  const { signIn } = useAuthSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    defaultValues: { username: '', password: '' },
    mode: 'onChange',
  });

  const onSubmit = handleSubmit(async ({ username, password }) => {
    setError(null);
    setSubmitting(true);
    try {
      await signIn(username.trim(), password);
    } catch (cause) {
      // input is preserved on failure (TECH_SPEC §2.5)
      setError(cause instanceof Error ? cause.message : 'Login failed');
      setSubmitting(false);
    }
  });

  return (
    <Screen scroll>
      <Box gap="md" style={{ paddingTop: 48 }}>
        <AppText variant="title">SimpleInvoice</AppText>
        {error ? <ErrorBanner message={error} /> : null}
        <ElementField
          id="username"
          type="text"
          name="username"
          control={control}
          rules={{ required: 'Username is required' }}
          inputProps={{ autoCapitalize: 'none', autoCorrect: false }}
          ui={{ label: 'Username' }}
        />
        <ElementField
          id="password"
          type="text"
          name="password"
          control={control}
          rules={{ required: 'Password is required' }}
          inputProps={{ secureTextEntry: true }}
          ui={{ label: 'Password' }}
        />
        <AppButton
          title="Sign in"
          onPress={onSubmit}
          loading={submitting}
          disabled={!formState.isValid}
        />
      </Box>
    </Screen>
  );
}
