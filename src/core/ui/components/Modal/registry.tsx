import React from 'react';

import { InvoiceFilterModal } from './InvoiceFilter/InvoiceFilterModal';
import { InvoiceSortModal } from './InvoiceSort/InvoiceSortModal';
import { LoadingModal } from './Loading/LoadingModal';
import type { ModalPropsType } from './type';

const modalComponentMap: Record<
  ModalPropsType['type'],
  React.FunctionComponent
> = {
  loading: LoadingModal,
  'invoice-filter': InvoiceFilterModal,
  'invoice-sort': InvoiceSortModal,
};

export function getComponent(
  type: ModalPropsType['type'],
): React.FunctionComponent {
  return modalComponentMap[type];
}

// Whether tapping the dim backdrop (or Android back) dismisses the modal.
// Loading blocks until closed programmatically.
const backdropDismissMap: Record<ModalPropsType['type'], boolean> = {
  loading: false,
  'invoice-filter': true,
  'invoice-sort': true,
};

export function isBackdropDismissable(type: ModalPropsType['type']): boolean {
  return backdropDismissMap[type];
}
