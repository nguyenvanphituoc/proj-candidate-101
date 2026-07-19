import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

// Header Component
export interface ElementFormHeaderProps {
  label?: string;
  /** Shows the * marker; also sets `required` when `required` is unset. */
  mandatory?: boolean;
  required?: boolean;
  headerStyle?: StyleProp<ViewStyle>;
}

// Error Component
export interface ElementFormErrorProps {
  showError?: boolean;
  errorMessage?: string;
}

export interface ElementFormProps
  extends ElementFormHeaderProps,
    ElementFormErrorProps {
  leftComponent?: ReactNode;
  rightComponent?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
}
