import React, { useState } from 'react';
import { Pressable } from 'react-native';

import { AppButton } from '../../../primitives/AppButton';
import { AppText } from '../../../primitives/AppText';
import { Box } from '../../../primitives/Box';
import { colors, radius, spacing } from '../../../theme/tokens';
import { useModalContext } from '../context';
import { ModalCard } from '../shared/card';
import type { InvoiceSortDirection, InvoiceSortField } from '../type';

const SORT_FIELDS: { id: InvoiceSortField; label: string }[] = [
  { id: 'createdDate', label: 'Created date' },
  { id: 'dueDate', label: 'Due date' },
  { id: 'amount', label: 'Amount' },
];

const DIRECTIONS: { id: InvoiceSortDirection; label: string }[] = [
  { id: 'desc', label: 'Descending' },
  { id: 'asc', label: 'Ascending' },
];

export function InvoiceSortModal() {
  const { initialValue, onApply, close } = useModalContext('invoice-sort');

  const [field, setField] = useState<InvoiceSortField>(
    initialValue?.field ?? 'createdDate',
  );
  const [direction, setDirection] = useState<InvoiceSortDirection>(
    initialValue?.direction ?? 'desc',
  );

  const apply = () => {
    onApply({ field, direction });
    close();
  };

  return (
    <ModalCard title="Sort by" onClose={close}>
      <Box>
        {SORT_FIELDS.map(option => {
          const isSelected = option.id === field;
          return (
            <Pressable key={option.id} onPress={() => setField(option.id)}>
              <Box
                row
                align="center"
                style={{
                  padding: spacing.md,
                  borderRadius: radius.sm,
                  backgroundColor: isSelected ? colors.background : undefined,
                }}
              >
                <Box flex={1}>
                  <AppText>{option.label}</AppText>
                </Box>
                {isSelected ? (
                  <AppText color={colors.primary}>✓</AppText>
                ) : null}
              </Box>
            </Pressable>
          );
        })}
      </Box>

      <Box row gap="sm">
        {DIRECTIONS.map(option => {
          const isSelected = option.id === direction;
          return (
            <Pressable
              key={option.id}
              onPress={() => setDirection(option.id)}
              style={{ flex: 1 }}
            >
              <Box
                align="center"
                style={{
                  paddingVertical: spacing.sm,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.primary : colors.border,
                  backgroundColor: isSelected ? colors.background : undefined,
                }}
              >
                <AppText
                  variant="caption"
                  color={isSelected ? colors.primary : colors.textMuted}
                >
                  {option.label}
                </AppText>
              </Box>
            </Pressable>
          );
        })}
      </Box>

      <AppButton title="Apply" onPress={apply} />
    </ModalCard>
  );
}
