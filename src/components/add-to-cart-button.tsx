'use client';

import Link from 'next/link';

import { useCartHasHydrated } from '@/components/cart-store-provider';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import type { CartProductInput } from '@/types/cart';

type AddToCartButtonProps = {
  product: CartProductInput;
  className?: string;
};

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const hasHydrated = useCartHasHydrated();
  const isInCart = useCartStore((state) =>
    state.items.some((item) => item.id === product.id),
  );
  const addItem = useCartStore((state) => state.addItem);

  if (!hasHydrated) {
    return (
      <div
        aria-hidden
        className={cn(
          'h-11 w-full max-w-xs animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800 sm:max-w-sm',
          className,
        )}
      />
    );
  }

  if (isInCart) {
    return (
      <Link
        href="/cart"
        className={cn(
          'inline-flex h-11 w-full max-w-xs items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 sm:max-w-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2',
          'dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800',
          className,
        )}
      >
        Already in cart
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className={cn(
        'inline-flex h-11 w-full max-w-xs items-center justify-center rounded-lg bg-zinc-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 sm:max-w-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2',
        'dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white',
        className,
      )}
    >
      Add to Cart
    </button>
  );
}
