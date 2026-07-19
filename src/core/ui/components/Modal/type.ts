// ─── Core Value Types ────────────────────────────────────────────────────────

/**
 * Date range filter — bounds are YYYY-MM-DD strings (docs/domain.md),
 * null when that side is unbounded.
 */
export type InvoiceDateFilterValue = {
  fromDate: string | null;
  toDate: string | null;
};

export type InvoiceSortField = 'createdDate' | 'dueDate' | 'amount';
export type InvoiceSortDirection = 'asc' | 'desc';

export type InvoiceSortValue = {
  field: InvoiceSortField;
  direction: InvoiceSortDirection;
};

// ─── Modal Variant Props ──────────────────────────────────────────────────────

export interface LoadingModalPropsType {
  type: 'loading';
  /** Optional caption under the spinner (e.g. "Saving invoice…"). */
  message?: string;
}

export interface InvoiceFilterModalPropsType {
  type: 'invoice-filter';
  initialValue?: InvoiceDateFilterValue;
  /** Called with the chosen range when the user taps Apply. */
  onApply: (value: InvoiceDateFilterValue) => void;
}

export interface InvoiceSortModalPropsType {
  type: 'invoice-sort';
  initialValue?: InvoiceSortValue;
  /** Called with the chosen sort when the user taps Apply. */
  onApply: (value: InvoiceSortValue) => void;
}

export interface ConfirmModalPropsType {
  type: 'confirm';
  title?: string;
  message: string;
  /** Defaults to "Confirm". */
  confirmLabel?: string;
  /** Defaults to "Cancel". */
  cancelLabel?: string;
  /** Called after the modal closes when the user confirms. */
  onConfirm: () => void;
}

// Union of all modal variant props — extend here when adding new modal types
export type ModalPropsType =
  | LoadingModalPropsType
  | InvoiceFilterModalPropsType
  | InvoiceSortModalPropsType
  | ConfirmModalPropsType;

// ─── Context Type ─────────────────────────────────────────────────────────────

export interface BaseModalActionType {
  /** Dismisses the active modal. */
  close: () => void;
}

/**
 * Each context variant is the modal's own props plus shared actions,
 * distributed over the union so leaves keep their narrowed props.
 */
type ContextVariant<T extends ModalPropsType> = T & BaseModalActionType;

export type ModalContextType =
  | ContextVariant<LoadingModalPropsType>
  | ContextVariant<InvoiceFilterModalPropsType>
  | ContextVariant<InvoiceSortModalPropsType>
  | ContextVariant<ConfirmModalPropsType>;

// ─── Controller ───────────────────────────────────────────────────────────────

/**
 * Public API screens use to drive the root modal. Only one modal is visible
 * at a time; opening a new one replaces the current one.
 */
export type RootModalControllerType = {
  activeModal: ModalPropsType | null;
  openModal: (props: ModalPropsType) => void;
  closeModal: () => void;
};
