import React, { useState } from 'react';
import { AppButton, AppText, Box, ErrorBanner, Screen, TextField } from '@core/ui';
import { useAuthSession } from '@/app/providers/AuthSessionProvider';

export function LoginScreen() {
  const { signIn } = useAuthSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await signIn(username.trim(), password);
    } catch (cause) {
      // input is preserved on failure (TECH_SPEC §2.5)
      setError(cause instanceof Error ? cause.message : 'Login failed');
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll>
      <Box gap="md" style={{ paddingTop: 48 }}>
        <AppText variant="title">SimpleInvoice</AppText>
        {error ? <ErrorBanner message={error} /> : null}
        <TextField
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <AppButton
          title="Sign in"
          onPress={onSubmit}
          loading={submitting}
          disabled={!username.trim() || !password}
        />
      </Box>
    </Screen>
  );
}
