import type {
  Control,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
} from 'react-hook-form';
import type { TextInputProps } from 'react-native';

// ─── Core Value Types ────────────────────────────────────────────────────────

/**
 * Implemented field value types — plain primitives.
 */
export type TextValue = string;
export type DateValue = string; // YYYY-MM-DD (docs/domain.md: dates are YYYY-MM-dd strings)

/**
 * Selection is always an array; callers use the `single` prop to restrict the
 * UI to one item and read `value[0]` themselves.
 */
export type SelectionValue = { id: string; label: string };

// ─── Form Value Helpers ───────────────────────────────────────────────────────

type SetValueCallback<T> = (prev: T) => T;
export type SetFieldValue<T> = (value: T | SetValueCallback<T>) => void;

export interface BaseFormElementActionType<TValue> {
  value: TValue;
  setValue: SetFieldValue<TValue>;
  /** Forwarded from Controller's field.onBlur — triggers RHF validation on blur. */
  onBlur: () => void;
  /** Registers a function that opens the field's picker / focuses the input. */
  registerOpen: (fn: () => void) => void;
}

// ─── Base Props ───────────────────────────────────────────────────────────────

export interface BaseFormElementPropsType<TFieldValues extends FieldValues> {
  id: string;
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  disabled?: boolean;
  onChange?: (id: string, value: unknown) => void;
}

// ─── Field Variant Props ──────────────────────────────────────────────────────

export interface TextElementPropsType<TFieldValues extends FieldValues>
  extends BaseFormElementPropsType<TFieldValues> {
  type: 'text';
  initialValue?: string | null;
  maxLength?: number;
  multiline?: boolean;
  placeholder?: string;
  inputProps?: TextInputProps;
  /** Characters matching this pattern are stripped on change (e.g. /[^0-9.]/g). */
  replacePattern?: RegExp;
  replaceWith?: string;
}

/** Same as TextElementPropsType but renders with a character-count indicator. */
export interface LimitedTextElementPropsType<TFieldValues extends FieldValues>
  extends Omit<TextElementPropsType<TFieldValues>, 'type'> {
  type: 'text-limited';
}

export interface DatePickerElementPropsType<TFieldValues extends FieldValues>
  extends BaseFormElementPropsType<TFieldValues> {
  type: 'date';
  initialValue?: Date | string | null;
  placeholder?: string;
}

// Path constrained to keys whose value extends (or includes in a union) SelectionValue[]
type SelectionPath<TFieldValues extends FieldValues> = {
  [K in Path<TFieldValues>]: Extract<
    PathValue<TFieldValues, K>,
    SelectionValue[]
  > extends never
    ? never
    : K;
}[Path<TFieldValues>];

export interface SelectionElementPropsType<TFieldValues extends FieldValues>
  extends BaseFormElementPropsType<TFieldValues> {
  /** Path to the field in the form values — must hold SelectionValue[]. */
  name: SelectionPath<TFieldValues>;
  type: 'selection';
  /** All available options shown in the modal list. */
  options: SelectionValue[];
  /** If true, tapping an option selects it and closes the modal (radio behaviour). */
  single?: boolean;
  /** Placeholder text shown when nothing is selected. */
  placeholder?: string;
  /** Title shown in the modal header. Falls back to the placeholder. */
  title?: string;
  /** Pre-populate the field before the user interacts. */
  initialValue?: SelectionValue[];
  /** Label for the confirm button in multi-select mode. Defaults to "Confirm". */
  confirmLabel?: string;
}

// Union of all field variant props — extend here when adding new field types
export type ElementFieldPropsType<
  TFieldValues extends FieldValues = FieldValues,
> =
  | TextElementPropsType<TFieldValues>
  | LimitedTextElementPropsType<TFieldValues>
  | DatePickerElementPropsType<TFieldValues>
  | SelectionElementPropsType<TFieldValues>;

// ─── Context Type ─────────────────────────────────────────────────────────────

/**
 * Each context variant strips `onChange` from the props and adds shared actions
 * (value + setValue). Distributed over the union so each variant keeps its own
 * narrowed props and value type (TextValue for text, DateValue for date, etc.).
 */
type ContextVariant<
  TFieldValues extends FieldValues,
  T extends ElementFieldPropsType<TFieldValues>,
  TValue,
> = Omit<T, 'onChange'> & BaseFormElementActionType<TValue>;

export type FormElementContextType<
  TFieldValues extends FieldValues = FieldValues,
> =
  | ContextVariant<TFieldValues, TextElementPropsType<TFieldValues>, TextValue>
  | ContextVariant<
      TFieldValues,
      LimitedTextElementPropsType<TFieldValues>,
      TextValue
    >
  | ContextVariant<
      TFieldValues,
      DatePickerElementPropsType<TFieldValues>,
      DateValue
    >
  | ContextVariant<
      TFieldValues,
      SelectionElementPropsType<TFieldValues>,
      SelectionValue[]
    >;

// ─── Delegate ─────────────────────────────────────────────────────────────────

export type FormElementProviderDelegate<TValue = unknown> = {
  getValue: () => TValue;
  setValue: SetFieldValue<TValue>;
  getCurrentValue: () => TValue;
  /** Triggers the field's picker or focuses the input. */
  open: () => void;
};
