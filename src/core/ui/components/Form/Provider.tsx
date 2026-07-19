import React, { forwardRef } from 'react';
import { FieldValues, useController } from 'react-hook-form';

import { ElementFieldProvider } from './context';
import type {
  ElementFieldPropsType,
  FormElementContextType,
  FormElementProviderDelegate,
  SetFieldValue,
} from './type';
import { getInitialSelected } from './utils';

export type ElementFieldProviderProps<TFieldValues extends FieldValues> =
  React.PropsWithChildren<ElementFieldPropsType<TFieldValues>>;

type ElementFieldProviderComponent = <TFieldValues extends FieldValues>(
  props: ElementFieldProviderProps<TFieldValues> & {
    ref?: React.Ref<FormElementProviderDelegate>;
  },
) => React.ReactElement | null;

// Sole RHF bridge of the compound component. useController (instead of the
// render-prop <Controller>) lets every hook live at this component's top
// level — no inner/outer split. Children only interact with context
// (value / setValue / onBlur); RHF field.value stays the single source of truth.

const ProviderBase = forwardRef<
  FormElementProviderDelegate,
  ElementFieldProviderProps<FieldValues>
>(({ children, onChange: externalOnChange, ...formProps }, ref) => {
  const { field } = useController({
    control: formProps.control,
    name: formProps.name,
    rules: formProps.rules,
    defaultValue: getInitialSelected(formProps),
  });

  // Fall back to getInitialSelected only when RHF has no value yet
  // (i.e. the parent didn't set defaultValues for this field).
  const currentValue = field.value ?? getInitialSelected(formProps);

  const setValue: SetFieldValue<any> = React.useCallback(
    (newValue) => {
      const resolved =
        typeof newValue === 'function'
          ? (newValue as (prev: unknown) => unknown)(currentValue)
          : newValue;
      field.onChange(resolved); // single write → RHF is the truth
      externalOnChange?.(formProps.id, resolved); // notify parent if needed
    },
    [field, currentValue, externalOnChange, formProps.id],
  );

  // Open handler registry — picker fields register their open fn here
  const openFnRef = React.useRef<(() => void) | null>(null);
  const registerOpen = React.useCallback((fn: () => void) => {
    openFnRef.current = fn;
  }, []);

  React.useImperativeHandle(
    ref,
    () => ({
      getValue: () => currentValue,
      setValue,
      getCurrentValue: () => currentValue,
      open: () => openFnRef.current?.(),
    }),
    [currentValue, setValue],
  );

  const contextValue = React.useMemo(
    () =>
      ({
        ...formProps,
        value: currentValue,
        setValue,
        onBlur: field.onBlur, // forwarded so field components can trigger RHF blur validation
        registerOpen,
      }) satisfies FormElementContextType,
    [formProps, currentValue, setValue, field.onBlur, registerOpen],
  );

  return (
    <ElementFieldProvider value={contextValue}>{children}</ElementFieldProvider>
  );
});
ProviderBase.displayName = 'ElementFieldProvider';

export const Provider = ProviderBase as ElementFieldProviderComponent;
