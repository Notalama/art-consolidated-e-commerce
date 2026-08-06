import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Star } from 'lucide-react';

import { AddToCartButton } from '@/components/add-to-cart-button';
import { ProductImage } from '@/components/product-image';
import { fetchProductById } from '@/lib/api';
import {
  formatDiscountPercent,
  formatUsd,
  getDiscountedPrice,
} from '@/lib/format-money';

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function loadProduct(rawId: string) {
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return fetchProductById(id);
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);

  if (!product) {
    return {
      title: 'Product not found',
    };
  }

  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = await loadProduct(id);

  if (!product) {
    notFound();
  }

  const mainImage = product.images[0] ?? product.thumbnail;
  const discountedPrice = getDiscountedPrice(
    product.price,
    product.discountPercentage,
  );
  const hasDiscount = product.discountPercentage > 0;

  return (
    <article className="grid min-w-0 gap-6 py-2 sm:gap-8 lg:grid-cols-2 lg:gap-12">
      <div
        data-testid="product-details-image"
        className="relative aspect-square min-w-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800"
      >
        <ProductImage src={mainImage} alt={product.title} priority />
      </div>

      <div className="flex min-w-0 flex-col gap-5">
        <div className="flex min-w-0 flex-col gap-3">
          <h1
            data-testid="product-details-title"
            className="break-words text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl"
          >
            {product.title}
          </h1>

          <p
            data-testid="product-details-discount"
            className="inline-flex w-fit rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            {formatDiscountPercent(product.discountPercentage)}
          </p>

          <div className="flex flex-wrap items-baseline gap-3">
            <p
              data-testid="product-details-price"
              className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50"
            >
              {formatUsd(discountedPrice)}
            </p>
            {hasDiscount ? (
              <p className="text-base text-zinc-600 line-through dark:text-zinc-400">
                {formatUsd(product.price)}
              </p>
            ) : null}
          </div>

          <p
            data-testid="product-details-rating"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-700 dark:text-zinc-300"
          >
            <Star
              aria-hidden
              className="size-4 fill-amber-400 text-amber-400"
            />
            <span>{product.rating.toFixed(2)}</span>
          </p>
        </div>

        <p
          data-testid="product-details-description"
          className="break-words text-base leading-7 text-zinc-700 dark:text-zinc-300"
        >
          {product.description}
        </p>

        <AddToCartButton
          product={{
            id: product.id,
            title: product.title,
            price: discountedPrice,
            thumbnail: product.thumbnail,
          }}
        />
      </div>
    </article>
  );
}
