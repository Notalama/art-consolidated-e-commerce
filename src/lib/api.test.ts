import { afterEach, describe, expect, it, vi } from 'vitest';

import { fetchProductById, fetchProducts } from '@/lib/api';

const product = {
  id: 1,
  title: 'Essence Mascara',
  description: 'A mascara',
  price: 9.99,
  discountPercentage: 10.48,
  rating: 2.56,
  thumbnail: 'https://cdn.dummyjson.com/thumb.webp',
  images: ['https://cdn.dummyjson.com/1.webp'],
};

describe('fetchProducts', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns products on success', async () => {
    const payload = {
      products: [product],
      total: 1,
      skip: 0,
      limit: 30,
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => payload,
      }),
    );

    await expect(fetchProducts()).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/products');
  });

  it('throws when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(fetchProducts()).rejects.toThrow(
      'Failed to fetch products: 500',
    );
  });
});

describe('fetchProductById', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns a product on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => product,
      }),
    );

    await expect(fetchProductById(1)).resolves.toEqual(product);
    expect(fetch).toHaveBeenCalledWith('https://dummyjson.com/products/1');
  });

  it('returns null when the product is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    );

    await expect(fetchProductById(999)).resolves.toBeNull();
  });

  it('throws when the response is a server error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    await expect(fetchProductById(1)).rejects.toThrow(
      'Failed to fetch product 1: 500',
    );
  });
});
