'use client';

import { useRouter } from 'next/navigation';

import { useCartHasHydrated } from '@/components/cart-store-provider';
import { CartItemRow } from '@/components/cart-item-row';
import { CartSummary } from '@/components/cart-summary';
import { useCartStore } from '@/store/useCartStore';

export function CartView() {
  const router = useRouter();
  const hasHydrated = useCartHasHydrated();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const subtotal = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );

  if (!hasHydrated) {
    return (
      <div className="flex flex-col gap-6" aria-busy="true">
        <div className="h-8 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-40 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 py-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          Cart
        </h1>
        <p
          data-testid="cart-empty-message"
          className="text-base text-zinc-700 dark:text-zinc-300"
        >
          Your cart is empty.
        </p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="inline-flex h-11 items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
        Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="rounded-xl border border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900 sm:px-5">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onIncrease={(id) => updateQuantity(id, item.quantity + 1)}
              onDecrease={(id) => updateQuantity(id, item.quantity - 1)}
              onRemove={removeItem}
            />
          ))}
        </div>

        <CartSummary itemCount={itemCount} subtotal={subtotal} />
      </div>
    </div>
  );
}
