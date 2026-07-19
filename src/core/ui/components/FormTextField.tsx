import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { TextField, TextFieldProps } from './TextField';

interface FormTextFieldProps<T extends FieldValues>
  extends Omit<TextFieldProps, 'value' | 'onChangeText' | 'onBlur' | 'error'> {
  control: Control<T>;
  name: Path<T>;
}

/**
 * react-hook-form binding for TextField — validation messages (including
 * server rejections mapped back via setError) surface as the field error.
 */
export function FormTextField<T extends FieldValues>({
  control,
  name,
  ...fieldProps
}: FormTextFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          {...fieldProps}
          value={field.value as string | undefined}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
