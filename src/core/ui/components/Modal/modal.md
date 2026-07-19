# RootModal — Compound Component

A single app-wide modal host mirroring the Form strategy-registry pattern.
The overlay is a plain absolutely-positioned `View` with a dim backdrop
(no `react-native` `Modal`), rendered once at the root layout above the
navigator.

---

## File Map

```
Modal/
├── index.tsx        → <RootModal> host (backdrop + registry lookup) + public exports
├── type.ts          → value types, props variants, context union, controller
├── context.tsx      → useRootModal (screens) + useModalContext (leaves)
├── Provider.tsx     → sole state owner: <RootModalProvider>
├── registry.tsx     → type → component map + backdrop-dismiss map
├── shared/
│   └── card.tsx     → <ModalCard> dialog surface (title + ✕)
├── Loading/LoadingModal.tsx           → blocking spinner
├── InvoiceFilter/InvoiceFilterModal.tsx → date range (YYYY-MM-DD bounds)
└── InvoiceSort/InvoiceSortModal.tsx     → createdDate | dueDate | amount + direction
```

## Architecture

```
<RootModalProvider>     ← owns activeModal state; provides controller context
  <RootNavigator />
  <RootModal />         ← shell: dim backdrop, hardware back, registry lookup
    <LoadingModal />    ← pure UI leaf; reads props via useModalContext(type)
```

One modal at a time — `openModal` replaces the current one. Backdrop tap and
Android back dismiss per-type (`registry.tsx`); `loading` blocks until
`closeModal()` is called.

## Usage

```tsx
const { openModal, closeModal } = useRootModal();

openModal({ type: 'loading', message: 'Saving…' });   // later: closeModal()

openModal({
  type: 'invoice-filter',
  initialValue: filter,
  onApply: setFilter,
});

openModal({
  type: 'invoice-sort',
  initialValue: sort,                 // { field, direction }
  onApply: setSort,
});
```

## Extending — Adding Modal Types

1. Add a props variant in `type.ts` and extend the `ModalPropsType` /
   `ModalContextType` unions.
2. Build the leaf under its own folder using `useModalContext('<type>')`;
   call `close()` from context when done.
3. Register it in `registry.tsx` (component map + backdrop-dismiss map).
