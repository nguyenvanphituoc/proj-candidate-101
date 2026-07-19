import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import {
  AppButton,
  AppText,
  Box,
  colors,
  ElementField,
  ErrorBanner,
  Screen,
} from '@core/ui';
import { useAuthSession } from '@/app/providers/AuthSessionProvider';

import { PASSWORD_MIN_LENGTH } from '../../domain/schemas';

type LoginFormValues = {
  username: string;
  password: string;
};

export function LoginScreen() {
  const { signIn } = useAuthSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
          rules={{
            required: 'Password is required',
            minLength: {
              value: PASSWORD_MIN_LENGTH,
              message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
            },
          }}
          inputProps={{ secureTextEntry: !showPassword }}
          ui={{
            label: 'Password',
            rightComponent: (
              <Pressable
                onPress={() => setShowPassword(visible => !visible)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? 'Hide password' : 'Show password'
                }
              >
                <AppText color={colors.textMuted}>
                  {showPassword ? '🙈' : '👁'}
                </AppText>
              </Pressable>
            ),
          }}
        />
        <AppButton
          title="Sign in"
          onPress={onSubmit}
          loading={submitting}
          disabled={!formState.isValid}
        />
        <AppText
          variant="caption"
          color={colors.textMuted}
          style={{ textAlign: 'center' }}
        >
          Demo credentials: demo / demo123
        </AppText>
      </Box>
    </Screen>
  );
}
