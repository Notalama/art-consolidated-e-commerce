import type { Product, ProductResponse } from '../../src/types/product';
import productsFixture from '../../src/fixtures/products.json';

export const DEFAULT_FIXTURE_THUMBNAIL = '/fixtures/product.png';

export const productFixtures = productsFixture as ProductResponse;

export function getFixtureProduct(id: number): Product {
  const product = productFixtures.products.find((entry) => entry.id === id);

  if (!product) {
    throw new Error(`Missing product fixture for id ${id}`);
  }

  return product;
}
