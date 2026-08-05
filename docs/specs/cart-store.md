# Cart Store & Data Types

## Summary

Foundational client-side layer for the Arts Consolidated e-commerce app: DummyJSON product types, API fetch helpers, and a persisted Zustand cart store. No product list/detail UI in this slice — only shared types, data access, and cart state used by later pages.

## Goals

- Define typed product and cart models aligned with DummyJSON.
- Provide `fetchProducts()` and `fetchProductById(id)` against `https://dummyjson.com`.
- Provide `useCartStore` with add/remove/update/clear and derived totals.
- Persist cart items in `localStorage` under key `cart-storage` for the browser session (and across reloads).

## Non-goals

- Product list, product detail, or cart page UI.
- Checkout, auth, or server-side cart.
- Discount application in totals (totals use unit `price × quantity` only).
- Optimistic concurrency or multi-tab sync beyond Zustand persist defaults.

## Data types

### `Product`

Subset of DummyJSON product fields needed by the storefront:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `number` | Unique product id |
| `title` | `string` | Display name |
| `description` | `string` | Long description |
| `price` | `number` | Unit price (USD) |
| `discountPercentage` | `number` | Percent off (display only in this slice) |
| `rating` | `number` | Average rating |
| `thumbnail` | `string` | Primary image URL |
| `images` | `string[]` | Gallery URLs |

Extra DummyJSON fields may exist at runtime; the typed surface for the app is the table above (additional fields may be typed as optional if needed for forward compatibility).

### `ProductResponse`

List endpoint envelope from `GET /products`:

| Field | Type |
| --- | --- |
| `products` | `Product[]` |
| `total` | `number` |
| `skip` | `number` |
| `limit` | `number` |

### `CartItem`

Cart line item (snapshot of product fields needed for display + pricing):

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `number` | Product id (unique key in cart) |
| `title` | `string` | Snapshot at add time |
| `price` | `number` | Unit price snapshot |
| `thumbnail` | `string` | Image snapshot |
| `quantity` | `number` | Integer ≥ 1 |

## API client

Base URL: `https://dummyjson.com`

| Function | Behavior |
| --- | --- |
| `fetchProducts()` | `GET /products` → parse JSON as `ProductResponse`. Throw on non-OK response. |
| `fetchProductById(id)` | `GET /products/{id}` → parse JSON as `Product`. Throw on non-OK / missing product. |

Suggested module path: `src/lib/api/products.ts` (or equivalent kebab-case under `src/lib/`).

## Zustand store: `useCartStore`

Suggested module path: `src/stores/cart-store.ts`.

### State

| Field | Type | Initial |
| --- | --- | --- |
| `items` | `CartItem[]` | `[]` |

### Actions

| Action | Behavior |
| --- | --- |
| `addItem(product)` | Accept a product-like payload (`id`, `title`, `price`, `thumbnail`). If `id` already in `items`, increment that line’s `quantity` by 1. Otherwise append `{ ...product, quantity: 1 }`. |
| `removeItem(id)` | Remove the line with matching `id` entirely (any quantity). |
| `updateQuantity(id, quantity)` | Set quantity for `id`. If `quantity < 1`, remove the line (same as `removeItem`). |
| `clearCart()` | Reset `items` to `[]`. |

### Calculated getters

Implemented on the store (callable via `useCartStore.getState()` / selectors):

| Getter | Formula |
| --- | --- |
| `totalItems()` | Sum of all `item.quantity` |
| `totalPrice()` | Sum of `item.price * item.quantity` for all items |

Do not apply `discountPercentage` in `totalPrice` for this slice.

### Persistence

- Middleware: Zustand `persist`.
- Storage: `localStorage`.
- Key: `'cart-storage'`.
- Persist only `items` (not derived getters).
- After reload, rehydrated `items` must restore quantities and allow getters to recompute correctly.

## E2E test seam

BDD scenarios exercise store behavior in the browser (not Node unit tests). Implementation must expose a read/write test API on `window` when `NEXT_PUBLIC_E2E=1` (Playwright `webServer` / env):

```ts
window.__CART_STORE__ = {
  getItems(): CartItem[];
  addItem(product: Omit<CartItem, 'quantity'>): void;
  removeItem(id: number): void;
  updateQuantity(id: number, quantity: number): void;
  clearCart(): void;
  totalItems(): number;
  totalPrice(): number;
};
```

Hydration: steps that seed or assert cart state must wait until persist rehydration has finished (e.g. `persist.hasHydrated()` / `onFinishHydration`) so reloads are deterministic.

Playwright `webServer` should set `NEXT_PUBLIC_E2E=1` when running BDD.

## Acceptance criteria

1. Types `Product`, `ProductResponse`, and `CartItem` exist and match this spec.
2. `fetchProducts()` and `fetchProductById(id)` call DummyJSON and return typed data (or throw on failure).
3. `addItem` on an empty cart creates one line with `quantity: 1`.
4. `addItem` for an existing `id` increments quantity; unique line count unchanged.
5. `removeItem` removes that product from the cart.
6. `totalItems` and `totalPrice` match the formulas above for multi-line carts.
7. After reload, cart contents match pre-reload state and `localStorage['cart-storage']` is present.
8. BDD scenarios in `e2e/features/cart_store.feature` pass once implementation is complete.

## File plan (implementation phase — not yet)

| Path | Role |
| --- | --- |
| `src/types/product.ts` | `Product`, `ProductResponse` |
| `src/types/cart.ts` | `CartItem` |
| `src/lib/api/products.ts` | Fetch helpers |
| `src/stores/cart-store.ts` | Zustand store + persist |
| App layout / client provider | Mount store + optional `__CART_STORE__` seam |

## Trade-offs

- **Price snapshot in `CartItem`:** DummyJSON prices can change; cart holds price at add time for stable totals.
- **No discount in totals:** Keeps this layer simple; detail page can still display `discountPercentage`.
- **E2E via `window.__CART_STORE__`:** Avoids needing cart UI for this slice; gated by `NEXT_PUBLIC_E2E` so production builds stay clean.
- **Getters as functions on the store:** Matches the assignment; UI can also use external selectors later if preferred.

## Known limitations

- No multi-tab conflict resolution beyond last-write-wins from `localStorage`.
- No stock/quantity caps from DummyJSON `stock`.
- API client has no retry/cache layer yet.
