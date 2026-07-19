import React from 'react';
import { TextInput } from 'react-native';

import { colors, typography } from '../../../theme/tokens';
import { useElementField } from '../context';

/**
 * Masked YYYY-MM-DD input — dependency-free (no native picker module is
 * installed). The form value is the canonical YYYY-MM-DD string
 * (docs/domain.md); range/validity rules live in the form schema.
 * Swapping in a native calendar later only touches this leaf.
 */
function maskDate(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)];
  return parts.filter(Boolean).join('-');
}

export function DateField() {
  const { value, setValue, onBlur, disabled, placeholder, registerOpen } =
    useElementField('date');

  const inputRef = React.useRef<TextInput>(null);
  React.useEffect(() => {
    registerOpen(() => inputRef.current?.focus());
  }, [registerOpen]);

  return (
    <TextInput
      ref={inputRef}
      style={{
        paddingVertical: 0,
        fontSize: typography.body.fontSize,
        color: colors.text,
      }}
      placeholderTextColor={colors.textMuted}
      value={value}
      onChangeText={text => setValue(maskDate(text))}
      onBlur={onBlur}
      placeholder={placeholder ?? 'YYYY-MM-DD'}
      keyboardType="number-pad"
      maxLength={10}
      editable={!disabled}
    />
  );
}
