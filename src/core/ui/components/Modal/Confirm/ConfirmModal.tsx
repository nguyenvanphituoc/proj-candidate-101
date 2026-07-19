import React from 'react';

import { AppButton } from '../../../primitives/AppButton';
import { AppText } from '../../../primitives/AppText';
import { Box } from '../../../primitives/Box';
import { colors } from '../../../theme/tokens';
import { useModalContext } from '../context';
import { ModalCard } from '../shared/card';

export function ConfirmModal() {
  const { title, message, confirmLabel, cancelLabel, onConfirm, close } =
    useModalContext('confirm');

  const confirm = () => {
    close();
    onConfirm();
  };

  return (
    <ModalCard title={title} onClose={close}>
      <AppText color={colors.textMuted}>{message}</AppText>
      <Box row gap="sm">
        <Box flex={1}>
          <AppButton
            title={cancelLabel ?? 'Cancel'}
            variant="secondary"
            onPress={close}
          />
        </Box>
        <Box flex={1}>
          <AppButton title={confirmLabel ?? 'Confirm'} onPress={confirm} />
        </Box>
      </Box>
    </ModalCard>
  );
}
