import type { Product, ProductResponse } from '@/types/product';

const BASE_URL = 'https://dummyjson.com';

export async function fetchProducts(): Promise<ProductResponse> {
  const response = await fetch(`${BASE_URL}/products`);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return response.json() as Promise<ProductResponse>;
}

export async function fetchProductById(id: number): Promise<Product | null> {
  const response = await fetch(`${BASE_URL}/products/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}: ${response.status}`);
  }

  return response.json() as Promise<Product>;
}
