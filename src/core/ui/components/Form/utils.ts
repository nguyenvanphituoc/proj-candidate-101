import type { ElementFieldPropsType } from './type';

// ─── Initial State ────────────────────────────────────────────────────────────

/** Formats a Date as the canonical form value: YYYY-MM-DD (docs/domain.md). */
function toDateString(raw: Date | string): string {
  if (typeof raw === 'string') return raw;
  const y = raw.getFullYear();
  const m = String(raw.getMonth() + 1).padStart(2, '0');
  const d = String(raw.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns the initial RHF value for a field based on its props.
 * Used as Controller's defaultValue fallback when the parent form's
 * defaultValues don't cover the field.
 */
export function getInitialSelected(ctx: ElementFieldPropsType): unknown {
  switch (ctx.type) {
    case 'text':
    case 'text-limited':
      return ctx.initialValue ?? '';
    case 'date':
      return ctx.initialValue == null ? '' : toDateString(ctx.initialValue);
    case 'selection':
      return ctx.initialValue ?? [];
    default:
      return '';
  }
}
