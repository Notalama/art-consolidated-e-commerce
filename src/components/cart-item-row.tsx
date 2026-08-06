'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';

import { ProductImage } from '@/components/product-image';
import { formatUsd } from '@/lib/format-money';
import { cn } from '@/lib/utils';
import type { CartItem } from '@/types/cart';

type CartItemRowProps = {
  item: CartItem;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
  className?: string;
};

export function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  className,
}: CartItemRowProps) {
  const lineSubtotal = item.price * item.quantity;
  const canDecrease = item.quantity > 1;

  return (
    <article
      data-testid={`cart-line-${item.id}`}
      className={cn(
        'flex flex-col gap-4 border-b border-zinc-200 py-4 last:border-b-0 sm:flex-row sm:items-center dark:border-zinc-800',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100 sm:size-24">
          <ProductImage src={item.thumbnail} alt={item.title} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Link
            href={`/products/${item.id}`}
            className="truncate text-base font-semibold text-zinc-900 hover:underline dark:text-zinc-50"
          >
            {item.title}
          </Link>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {formatUsd(item.price)} each
          </p>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 sm:hidden">
            {formatUsd(lineSubtotal)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end sm:gap-6">
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            aria-label={`Decrease quantity of ${item.title}`}
            disabled={!canDecrease}
            onClick={() => onDecrease(item.id)}
            className={cn(
              'inline-flex size-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-900 transition-colors',
              'hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40',
              'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800',
            )}
          >
            <Minus aria-hidden className="size-4" />
          </button>

          <span
            data-testid="cart-line-quantity"
            className="min-w-8 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-50"
          >
            {item.quantity}
          </span>

          <button
            type="button"
            aria-label={`Increase quantity of ${item.title}`}
            onClick={() => onIncrease(item.id)}
            className={cn(
              'inline-flex size-9 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-900 transition-colors',
              'hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800',
            )}
          >
            <Plus aria-hidden className="size-4" />
          </button>
        </div>

        <p className="hidden min-w-20 text-right text-sm font-semibold text-zinc-900 sm:block dark:text-zinc-50">
          {formatUsd(lineSubtotal)}
        </p>

        <button
          type="button"
          aria-label={`Remove ${item.title}`}
          onClick={() => onRemove(item.id)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-zinc-600 transition-colors',
            'hover:bg-zinc-100 hover:text-zinc-900',
            'dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50',
          )}
        >
          <Trash2 aria-hidden className="size-4" />
          <span>Remove</span>
        </button>
      </div>
    </article>
  );
}
