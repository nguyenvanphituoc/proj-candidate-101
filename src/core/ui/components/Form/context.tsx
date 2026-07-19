import { createContext, useContext } from 'react';

import type { FormElementContextType } from './type';

const ElementFieldContext = createContext<FormElementContextType | undefined>(undefined);

// Extract the matching variant from the union by its `type` field
type ElementFieldType = FormElementContextType['type'];
type ElementFieldContextReturn<T extends ElementFieldType = ElementFieldType> = Extract<
  FormElementContextType,
  { type: T }
>;

export function useElementFieldContext<T extends ElementFieldType = ElementFieldType>(
  type?: T,
): ElementFieldContextReturn<T> {
  const context = useContext(ElementFieldContext);
  if (!context) {
    throw new Error('ElementField components must be used within <ElementField>');
  }
  if (type && context.type !== type) {
    throw new Error(`ElementFieldContext type mismatch: expected '${type}', got '${context.type}'`);
  }
  return context as ElementFieldContextReturn<T>;
}

export const ElementFieldProvider = ElementFieldContext.Provider;

export const useElementField = useElementFieldContext;
