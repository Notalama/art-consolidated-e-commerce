# Cart Page

## Summary

Replace the `/cart` placeholder with a client-driven cart UI backed by `useCartStore`. Shoppers see line items with quantity controls and removal, a order summary (counts and totals), and an empty state that links back to the catalog.

## Goals

- Route `/cart` shows cart contents from persisted Zustand state.
- Each line: thumbnail, title, unit price, quantity stepper (`−` / `+`), line subtotal, remove control.
- Summary: total item count, order subtotal, total price.
- Empty cart: clear empty-state copy + **Continue Shopping** → `/`.
- Updates (quantity / remove) reflect immediately in the list, summary, and header badge.

## Non-goals

- Checkout / payment.
- Shipping, tax, coupons (total === order subtotal for this slice).
- Manual quantity text input (stepper only; details page stays one-shot add).
- Server-side cart API.

## Route & data

| Item | Detail |
| --- | --- |
| Route | `/cart` → `src/app/cart/page.tsx` |
| State | `useCartStore` (`items`, `updateQuantity`, `removeItem`, `totalItems`, `totalPrice`) |
| Hydration | Wait for persist hydration before rendering lines vs empty (avoid empty flash when cart has items) |

Page (or cart body) is a **client component** island; layout/header remain as today.

## UI requirements

### Empty state

When `items.length === 0` (after hydration):

- Heading **Cart** (or equivalent).
- Empty message (e.g. “Your cart is empty”).
- Button **Continue Shopping** → navigates to `/`.

### Line items (when cart has items)

For each `CartItem`:

| Element | Behavior |
| --- | --- |
| Thumbnail | `thumbnail` image; `alt` = title |
| Title | `title` (link to `/products/{id}` optional but nice) |
| Unit price | USD format of `price` |
| Quantity | `−` / displayed quantity / `+`; min `1`; `−` at `1` may stay at 1 or remove — **prefer**: `−` at quantity `1` does not go below 1; use **Remove** to delete |
| Line subtotal | `price × quantity` (USD) |
| Remove | Removes the line entirely (`removeItem(id)`) |

Accessible names:

- Decrease: **Decrease quantity** (scoped per line / with product context)
- Increase: **Increase quantity**
- Remove: **Remove** (or **Remove {title}**)

### Summary

| Field | Source |
| --- | --- |
| Total item count | `totalItems()` (sum of quantities) |
| Order subtotal | `totalPrice()` |
| Total price | Same as order subtotal (no fees in this slice) |

Summary remains visible alongside the list on larger screens (sidebar/card); stacks below or above on mobile.

### Header badge

Quantity/remove must keep the header cart badge in sync (same store).

## Accessibility

- Page `h1` **Cart**.
- Empty and filled states announced via clear text.
- Stepper and remove are real buttons with accessible names.
- Prices visible as text.

## Acceptance criteria

1. Empty cart shows empty message and **Continue Shopping**; click goes to `/`.
2. Seeded cart shows each product with quantity and correct line/order totals.
3. Removing a line updates the list and totals immediately (and badge).
4. BDD scenarios in `e2e/features/cart_page.feature` pass.

## File plan (implementation phase — not yet)

| Path | Role |
| --- | --- |
| `src/app/cart/page.tsx` | Cart route composition |
| `src/components/cart-page.tsx` (or similar) | Client cart UI |
| `src/components/cart-line-item.tsx` | Optional line extraction |
| Reuse | `formatUsd`, `ProductImage` / `next/image`, `useCartStore`, `useCartHasHydrated` |

## Trade-offs

- **Client page:** Cart is 100% client state; RSC fetch not required.
- **Subtotal === total:** Keeps assignment scope small; label both for realistic layout.
- **Stepper without free-typed input:** Matches earlier product-details decision (configure qty on cart via `+/−` only).

## Known limitations

- No stock cap on `+` (DummyJSON `stock` not enforced here unless added later).
- No multi-currency.
