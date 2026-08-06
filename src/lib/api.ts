import type { Product, ProductResponse } from '@/types/product';
import {
  getFixtureProductById,
  getFixtureProducts,
} from '@/lib/product-fixtures';

const BASE_URL = 'https://dummyjson.com';

function useProductFixtures() {
  return process.env.USE_PRODUCT_FIXTURES === '1';
}

export async function fetchProducts(): Promise<ProductResponse> {
  if (useProductFixtures()) {
    return getFixtureProducts();
  }

  const response = await fetch(`${BASE_URL}/products`);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return response.json() as Promise<ProductResponse>;
}

export async function fetchProductById(id: number): Promise<Product | null> {
  if (useProductFixtures()) {
    return getFixtureProductById(id);
  }

  const response = await fetch(`${BASE_URL}/products/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}: ${response.status}`);
  }

  return response.json() as Promise<Product>;
}
