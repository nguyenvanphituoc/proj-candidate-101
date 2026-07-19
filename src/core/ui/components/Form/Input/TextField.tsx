import React from 'react';
import { TextInput } from 'react-native';

import { colors, typography } from '../../../theme/tokens';
import { useElementField } from '../context';

export function TextField() {
  const {
    placeholder,
    maxLength,
    multiline,
    inputProps,
    setValue,
    onBlur,
    disabled,
    value,
    replacePattern,
    replaceWith = '',
    registerOpen,
  } = useElementField('text');

  const inputRef = React.useRef<TextInput>(null);
  React.useEffect(() => {
    registerOpen(() => inputRef.current?.focus());
  }, [registerOpen]);

  const handleChangeText = (text: string) => {
    setValue(replacePattern ? text.replace(replacePattern, replaceWith) : text);
  };

  return (
    <TextInput
      ref={inputRef}
      placeholderTextColor={colors.textMuted}
      {...inputProps}
      style={[
        {
          paddingVertical: multiline ? 12 : 0,
          fontSize: typography.body.fontSize,
          color: colors.text,
          minHeight: multiline ? 88 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
        },
        inputProps?.style,
      ]}
      value={value}
      onChangeText={handleChangeText}
      onBlur={onBlur}
      placeholder={placeholder}
      maxLength={maxLength}
      multiline={multiline}
      editable={!disabled}
    />
  );
}
