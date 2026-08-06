import { type Page, expect } from '@playwright/test';

export type CartItemSeed = {
  id: number;
  title: string;
  price: number;
  thumbnail?: string;
  quantity?: number;
};

type CartStoreApi = {
  getItems: () => Array<{
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    quantity: number;
  }>;
  addItem: (product: {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
  }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

declare global {
  interface Window {
    __CART_STORE__?: CartStoreApi;
  }
}

export class CartStorePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async waitUntilReady() {
    await this.page.waitForFunction(
      () => typeof window.__CART_STORE__?.getItems === 'function',
      { timeout: 5_000 },
    );
  }

  async clearCart() {
    await this.page.evaluate(() => {
      window.__CART_STORE__!.clearCart();
    });
  }

  async addItem(product: CartItemSeed) {
    await this.page.evaluate((item) => {
      window.__CART_STORE__!.addItem({
        id: item.id,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail ?? `https://cdn.dummyjson.com/product-${item.id}.jpg`,
      });
    }, product);
  }

  async seedItem(product: Required<Pick<CartItemSeed, 'id' | 'title' | 'price' | 'quantity'>> & {
    thumbnail?: string;
  }) {
    await this.clearCart();
    const thumbnail =
      product.thumbnail ?? `https://cdn.dummyjson.com/product-${product.id}.jpg`;

    for (let i = 0; i < product.quantity; i += 1) {
      await this.addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail,
      });
    }
  }

  async seedItems(
    products: Array<
      Required<Pick<CartItemSeed, 'id' | 'title' | 'price' | 'quantity'>> & {
        thumbnail?: string;
      }
    >,
  ) {
    await this.clearCart();

    for (const product of products) {
      const thumbnail =
        product.thumbnail ?? `https://cdn.dummyjson.com/product-${product.id}.jpg`;

      for (let i = 0; i < product.quantity; i += 1) {
        await this.addItem({
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail,
        });
      }
    }
  }

  async removeItem(id: number) {
    await this.page.evaluate((productId) => {
      window.__CART_STORE__!.removeItem(productId);
    }, id);
  }

  async decreaseQuantity(id: number, by = 1) {
    await this.page.evaluate(
      ({ productId, amount }) => {
        const item = window.__CART_STORE__!.getItems().find(
          (entry) => entry.id === productId,
        );

        if (!item) {
          throw new Error(`Cart item ${productId} not found`);
        }

        window.__CART_STORE__!.updateQuantity(productId, item.quantity - amount);
      },
      { productId: id, amount: by },
    );
  }

  async reload() {
    await this.page.reload();
  }

  async getItems() {
    return this.page.evaluate(() => window.__CART_STORE__!.getItems());
  }

  async getTotalItems() {
    return this.page.evaluate(() => window.__CART_STORE__!.totalItems());
  }

  async getTotalPrice() {
    return this.page.evaluate(() => window.__CART_STORE__!.totalPrice());
  }

  async expectUniqueProductCount(count: number) {
    const items = await this.getItems();
    expect(items).toHaveLength(count);
  }

  async expectEmpty() {
    const items = await this.getItems();
    expect(items).toEqual([]);
  }

  async expectItemQuantity(id: number, quantity: number) {
    const items = await this.getItems();
    const item = items.find((entry) => entry.id === id);
    expect(item, `expected cart item with id ${id}`).toBeTruthy();
    expect(item!.quantity).toBe(quantity);
  }

  async expectTotalItems(count: number) {
    expect(await this.getTotalItems()).toBe(count);
  }

  async expectTotalPrice(amount: number) {
    expect(await this.getTotalPrice()).toBeCloseTo(amount, 2);
  }

  async expectLocalStorageKey(key: string) {
    const value = await this.page.evaluate((storageKey) => {
      return window.localStorage.getItem(storageKey);
    }, key);

    expect(value, `expected localStorage key "${key}"`).toBeTruthy();
  }
}
