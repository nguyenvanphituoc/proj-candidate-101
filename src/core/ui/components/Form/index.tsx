import React, { forwardRef } from 'react';
import { FieldError, FieldErrors, FieldValues, useFormState } from 'react-hook-form';

import { Box } from '../../primitives/Box';
import { colors, radius, spacing } from '../../theme/tokens';

import { Provider } from './Provider';
import { getComponent } from './registry';
import type {
  ElementFieldPropsType,
  FormElementProviderDelegate,
} from './type';
import { ElementFormError } from './shared/error';
import { ElementFormHeader } from './shared/header';
import { ElementFormProps } from './shared/type';

export * from './type';
export type { ElementFormProps } from './shared/type';

export type ElementFieldProps<TFieldValues extends FieldValues> =
  ElementFieldPropsType<TFieldValues> & {
    ui: ElementFormProps;
  };

type ElementFieldComponent = <TFieldValues extends FieldValues>(
  props: ElementFieldProps<TFieldValues> & {
    ref?: React.Ref<FormElementProviderDelegate>;
  },
) => React.ReactElement | null;

/** Resolves dotted paths ("customer.email") that plain `errors[name]` misses. */
function getFieldError(
  errors: FieldErrors<FieldValues>,
  name: string,
): FieldError | undefined {
  return name
    .split('.')
    .reduce<unknown>(
      (node, key) => (node as Record<string, unknown> | undefined)?.[key],
      errors,
    ) as FieldError | undefined;
}

const ElementFieldBase = forwardRef<
  FormElementProviderDelegate,
  ElementFieldProps<FieldValues>
>(({ ui, ...formProps }, ref) => {
  const isDisabled = formProps.disabled === true;

  const FieldComponent = getComponent(formProps.type);
  const { errors } = useFormState({
    control: formProps.control,
    name: formProps.name,
  });

  const {
    containerStyle,
    headerStyle,
    label,
    mandatory,
    required,
    showError,
    errorMessage,
    leftComponent,
    rightComponent,
    inputContainerStyle,
  } = ui;

  const fieldError = getFieldError(errors, formProps.name);
  const fieldErrorMsg = fieldError?.message?.toString() ?? errorMessage;

  return (
    <Provider ref={ref} {...formProps}>
      <Box gap="xs" style={containerStyle}>
        <ElementFormHeader
          label={label}
          mandatory={mandatory}
          required={required ?? mandatory}
          headerStyle={headerStyle}
        />
        <Box
          row
          align="center"
          style={[
            {
              minHeight: 48,
              borderWidth: 1,
              borderRadius: radius.md,
              paddingHorizontal: spacing.md,
              backgroundColor: isDisabled ? colors.background : colors.surface,
              borderColor: fieldError ? colors.danger : colors.border,
            },
            inputContainerStyle,
          ]}
        >
          {leftComponent}
          <Box flex={1}>
            <FieldComponent />
          </Box>
          {rightComponent}
        </Box>
        <ElementFormError showError={showError} errorMessage={fieldErrorMsg} />
      </Box>
    </Provider>
  );
});

ElementFieldBase.displayName = 'ElementField';

export const ElementField = ElementFieldBase as ElementFieldComponent;
