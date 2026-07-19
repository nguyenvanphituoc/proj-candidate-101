import { createContext, useContext } from 'react';

import type { ModalContextType, RootModalControllerType } from './type';

const RootModalControllerContext = createContext<RootModalControllerType | undefined>(undefined);
const ActiveModalContext = createContext<ModalContextType | undefined>(undefined);

/** Screen-facing hook: open / close the root modal from anywhere in the app. */
export function useRootModal(): RootModalControllerType {
  const context = useContext(RootModalControllerContext);
  if (!context) {
    throw new Error('useRootModal must be used within <RootModalProvider>');
  }
  return context;
}

// Extract the matching variant from the union by its `type` field
type ActiveModalType = ModalContextType['type'];
type ActiveModalContextReturn<T extends ActiveModalType = ActiveModalType> = Extract<
  ModalContextType,
  { type: T }
>;

/** Leaf-facing hook: the active modal's props + close, narrowed by `type`. */
export function useModalContext<T extends ActiveModalType = ActiveModalType>(
  type?: T,
): ActiveModalContextReturn<T> {
  const context = useContext(ActiveModalContext);
  if (!context) {
    throw new Error('Modal leaf components must be rendered by <RootModal>');
  }
  if (type && context.type !== type) {
    throw new Error(`ModalContext type mismatch: expected '${type}', got '${context.type}'`);
  }
  return context as ActiveModalContextReturn<T>;
}

export const RootModalControllerProvider = RootModalControllerContext.Provider;
export const ActiveModalProvider = ActiveModalContext.Provider;
