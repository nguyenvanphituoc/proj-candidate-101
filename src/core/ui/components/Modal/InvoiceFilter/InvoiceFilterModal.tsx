import React, { useState } from 'react';

import { AppButton } from '../../../primitives/AppButton';
import { AppInput } from '../../../primitives/AppInput';
import { AppText } from '../../../primitives/AppText';
import { Box } from '../../../primitives/Box';
import { colors } from '../../../theme/tokens';
import { useModalContext } from '../context';
import { ModalCard } from '../shared/card';

// Same mask as Form/DatePicker — dependency-free YYYY-MM-DD entry.
function maskDate(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)];
  return parts.filter(Boolean).join('-');
}

function DateBound({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Box gap="xs">
      <AppText variant="caption" color={colors.textMuted}>
        {label}
      </AppText>
      <AppInput
        value={value}
        onChangeText={text => onChange(maskDate(text))}
        placeholder="YYYY-MM-DD"
        keyboardType="number-pad"
        maxLength={10}
      />
    </Box>
  );
}

export function InvoiceFilterModal() {
  const { initialValue, onApply, close } = useModalContext('invoice-filter');

  const [fromDate, setFromDate] = useState(initialValue?.fromDate ?? '');
  const [toDate, setToDate] = useState(initialValue?.toDate ?? '');

  const apply = () => {
    onApply({ fromDate: fromDate || null, toDate: toDate || null });
    close();
  };

  const reset = () => {
    setFromDate('');
    setToDate('');
  };

  return (
    <ModalCard title="Filter by date" onClose={close}>
      <DateBound label="From" value={fromDate} onChange={setFromDate} />
      <DateBound label="To" value={toDate} onChange={setToDate} />
      <Box row gap="sm">
        <Box flex={1}>
          <AppButton title="Reset" variant="secondary" onPress={reset} />
        </Box>
        <Box flex={1}>
          <AppButton title="Apply" onPress={apply} />
        </Box>
      </Box>
    </ModalCard>
  );
}
