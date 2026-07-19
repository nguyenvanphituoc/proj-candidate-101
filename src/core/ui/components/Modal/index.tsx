import React from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '../../theme/tokens';
import { ActiveModalProvider, useRootModal } from './context';
import { getComponent, isBackdropDismissable } from './registry';
import type { ModalContextType } from './type';

export * from './type';
export { RootModalProvider } from './Provider';
export { useRootModal, useModalContext } from './context';

/**
 * Absolute overlay host — render once inside <RootModalProvider>, after the
 * navigator, so the active modal stacks above every screen. The dim backdrop
 * dismisses per-type (registry); loading blocks until closed programmatically.
 */
export function RootModal() {
  const { activeModal, closeModal } = useRootModal();

  const activeType = activeModal?.type;
  const dismissable = activeType ? isBackdropDismissable(activeType) : false;

  // Android hardware back mirrors the backdrop behaviour while a modal is up.
  React.useEffect(() => {
    if (!activeType) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (dismissable) closeModal();
      return true;
    });
    return () => subscription.remove();
  }, [activeType, dismissable, closeModal]);

  const contextValue = React.useMemo<ModalContextType | null>(
    () => (activeModal ? { ...activeModal, close: closeModal } : null),
    [activeModal, closeModal],
  );

  if (!activeModal || !contextValue) return null;

  const ModalComponent = getComponent(activeModal.type);

  return (
    <ActiveModalProvider value={contextValue}>
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissable ? closeModal : undefined}
          accessibilityLabel="Dismiss modal"
        />
        <ModalComponent />
      </View>
    </ActiveModalProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
});
