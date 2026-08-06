import Link from 'next/link';
import { Star } from 'lucide-react';

import { ProductImage } from '@/components/product-image';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/product';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

type ProductCardProps = {
  product: Pick<Product, 'id' | 'title' | 'price' | 'rating' | 'thumbnail'>;
  priority?: boolean;
  className?: string;
};

export function ProductCard({
  product,
  priority = false,
  className,
}: ProductCardProps) {
  const { id, title, price, rating, thumbnail } = product;

  return (
    <Link
      href={`/products/${id}`}
      data-testid={`product-card-${id}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition duration-200',
        'hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2',
        'dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700',
        className,
      )}
    >
      <article data-testid="product-card" className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          <ProductImage
            src={thumbnail}
            alt={title}
            priority={priority}
            className="group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h2
            data-testid="product-card-title"
            className="line-clamp-2 h-10 overflow-hidden text-ellipsis text-base font-semibold leading-5 tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            {title}
          </h2>

          <div className="mt-auto flex items-center justify-between gap-3 pt-1">
            <p
              data-testid="product-card-price"
              className="text-sm font-semibold text-zinc-900 dark:text-zinc-50"
            >
              {currencyFormatter.format(price)}
            </p>

            <p
              data-testid="product-card-rating"
              className="inline-flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-300"
            >
              <Star
                aria-hidden
                className="size-4 fill-amber-400 text-amber-400"
              />
              <span>{rating.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
