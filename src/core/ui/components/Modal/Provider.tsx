import React from 'react';

import { RootModalControllerProvider } from './context';
import type { ModalPropsType, RootModalControllerType } from './type';

/**
 * Sole state owner of the compound component. Holds which modal (if any) is
 * active; leaves and screens only interact through context. Render once at
 * the app root, with <RootModal> as the last child so it overlays everything.
 */
export function RootModalProvider({ children }: React.PropsWithChildren) {
  const [activeModal, setActiveModal] = React.useState<ModalPropsType | null>(null);

  const openModal = React.useCallback(
    (props: ModalPropsType) => setActiveModal(props),
    [],
  );
  const closeModal = React.useCallback(() => setActiveModal(null), []);

  const contextValue = React.useMemo<RootModalControllerType>(
    () => ({ activeModal, openModal, closeModal }),
    [activeModal, openModal, closeModal],
  );

  return (
    <RootModalControllerProvider value={contextValue}>
      {children}
    </RootModalControllerProvider>
  );
}
