# Form — Compound Component

A type-safe, compound form field component backed by **react-hook-form**,
built on this project's primitives (`Box`, `AppText`, theme tokens).
Each field type stores its value as the simplest type that makes sense —
plain `string` for text/date, `SelectionValue[]` for selection.

---

## File Map

```
Form/
├── index.tsx          → Public entry: <ElementField> (shell + label/error UI)
├── type.ts            → All types: value types, props variants, context union, delegate
├── context.tsx        → React context + useElementField hook
├── Provider.tsx       → sole RHF bridge (useController) + context provider
├── registry.tsx       → type → component map; getComponent()
├── utils.ts           → getInitialSelected per field type
├── shared/
│   ├── type.ts        → ElementFormProps (label, error, layout slots)
│   ├── header.tsx     → <ElementFormHeader> (label + required marker)
│   └── error.tsx      → <ElementFormError> (inline validation message)
├── Input/
│   ├── TextField.tsx         → text leaf
│   └── LimitedTextField.tsx  → text + character counter leaf
├── DatePicker/
│   └── DateField.tsx  → masked YYYY-MM-DD input (no native picker dependency;
│                        swap this leaf for a native calendar later)
└── Selection/
    └── SelectionField.tsx → modal picker; `single` closes on first tap
```

---

## Architecture

```
<ElementField>          ← public API, owns shell UI (label, border, error)
  <Provider>           ← sole RHF bridge: useController → context + ref handle
    <TextField>        ← pure UI leaf; reads/writes via context only
```

**RHF is the single source of truth.**
Leaves never touch `control`, `name`, or `rules` — those live in Provider.
Leaves read `value` and call `setValue` / `onBlur` from `useElementField(type)`.

## Value Model

| Field type     | RHF value type       | Notes                                        |
|----------------|----------------------|----------------------------------------------|
| `text`         | `string`             | The text string directly                     |
| `text-limited` | `string`             | Same as `text`, renders a counter            |
| `date`         | `string`             | `YYYY-MM-DD` (docs/domain.md)                |
| `selection`    | `SelectionValue[]`   | Always an array; `single` for radio behaviour |

## Usage

```tsx
<ElementField
  id="email"
  type="text"
  name="email"
  control={control}
  placeholder="customer@example.com"
  inputProps={{ keyboardType: 'email-address' }}
  ui={{ label: 'Email', mandatory: true }}
/>

<ElementField
  id="currency"
  type="selection"
  name="currency"           // field type must be SelectionValue[]
  control={control}
  single
  options={[{ id: 'GBP', label: 'GBP' }]}
  placeholder="Select…"
  ui={{ label: 'Currency', mandatory: true }}
/>
```

Validation comes from the form's resolver (zod) or per-field `rules`;
errors surface automatically under the input.

## Extending — Adding Field Types

1. Add a props variant + context variant in `type.ts` and extend the unions.
2. Add the initial-value case in `utils.ts`.
3. Build the leaf under its own folder using `useElementField('<type>')`.
4. Register it in `registry.tsx`.
