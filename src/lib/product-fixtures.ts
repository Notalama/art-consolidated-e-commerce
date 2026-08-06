import type { Product, ProductResponse } from '@/types/product';

import productsFixture from '@/fixtures/products.json';

export const PRODUCT_FIXTURES = productsFixture as ProductResponse;

export function getFixtureProducts(): ProductResponse {
  return PRODUCT_FIXTURES;
}

export function getFixtureProductById(id: number): Product | null {
  return PRODUCT_FIXTURES.products.find((product) => product.id === id) ?? null;
}

export const DEFAULT_FIXTURE_THUMBNAIL = '/fixtures/product.png';
