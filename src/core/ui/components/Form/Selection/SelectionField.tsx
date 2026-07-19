import React, { useState } from 'react';
import { FlatList, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '../../../primitives/AppButton';
import { AppText } from '../../../primitives/AppText';
import { Box } from '../../../primitives/Box';
import { colors, spacing } from '../../../theme/tokens';
import { useElementField } from '../context';
import { SelectionValue } from '../type';

export function SelectionField() {
  const {
    value,
    setValue,
    onBlur,
    disabled,
    options,
    single,
    placeholder,
    title,
    confirmLabel = 'Confirm',
    registerOpen,
  } = useElementField('selection');

  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<SelectionValue[]>([]);

  const openModal = React.useCallback(() => {
    if (disabled) return;
    setDraft(value);
    setIsOpen(true);
  }, [disabled, value]);

  const openModalRef = React.useRef(openModal);
  openModalRef.current = openModal;
  React.useEffect(() => {
    registerOpen(() => openModalRef.current());
  }, [registerOpen]);

  const closeModal = () => {
    onBlur();
    setIsOpen(false);
  };

  const confirm = () => {
    setValue(draft);
    closeModal();
  };

  const selectOption = (option: SelectionValue) => {
    if (single) {
      // Radio behaviour: select and close in one tap.
      setValue([option]);
      closeModal();
      return;
    }
    setDraft(prev => {
      const exists = prev.some(s => s.id === option.id);
      return exists ? prev.filter(s => s.id !== option.id) : [...prev, option];
    });
  };

  const hasValue = value.length > 0;
  const displayLabel = hasValue
    ? value.map(s => s.label).join(', ')
    : placeholder ?? 'Select…';

  return (
    <>
      {/* ── Trigger row ──────────────────────────────────────────────────── */}
      <Pressable
        onPress={openModal}
        disabled={disabled}
        accessibilityRole="button"
      >
        <Box row align="center" style={{ minHeight: 46 }}>
          <Box flex={1}>
            <AppText
              color={hasValue ? colors.text : colors.textMuted}
              numberOfLines={1}
            >
              {displayLabel}
            </AppText>
          </Box>
          <AppText color={colors.textMuted}>▾</AppText>
        </Box>
      </Pressable>

      {/* ── Full-screen selection modal ──────────────────────────────────── */}
      <Modal
        visible={isOpen}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <Box
          flex={1}
          style={{
            backgroundColor: colors.surface,
            paddingTop: insets.top,
            paddingBottom: insets.bottom + spacing.md,
          }}
        >
          <Box
            row
            align="center"
            justify="space-between"
            style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}
          >
            <AppText variant="subtitle">{title ?? placeholder ?? 'Select'}</AppText>
            <Pressable onPress={closeModal} accessibilityRole="button" hitSlop={8}>
              <AppText color={colors.textMuted} variant="subtitle">
                ✕
              </AppText>
            </Pressable>
          </Box>

          <FlatList<SelectionValue>
            data={options}
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: spacing.sm }}
            renderItem={({ item }) => {
              const isSelected = (single ? value : draft).some(
                s => s.id === item.id,
              );
              return (
                <Pressable onPress={() => selectOption(item)}>
                  <Box
                    row
                    align="center"
                    style={{
                      padding: spacing.md,
                      borderRadius: 8,
                      backgroundColor: isSelected
                        ? colors.background
                        : undefined,
                    }}
                  >
                    <Box flex={1}>
                      <AppText>{item.label}</AppText>
                    </Box>
                    {isSelected ? (
                      <AppText color={colors.primary}>✓</AppText>
                    ) : null}
                  </Box>
                </Pressable>
              );
            }}
          />

          {!single && (
            <Box style={{ paddingHorizontal: spacing.md }}>
              <AppButton title={confirmLabel} onPress={confirm} />
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}
