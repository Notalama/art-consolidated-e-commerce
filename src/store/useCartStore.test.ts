import { beforeEach, describe, expect, it } from 'vitest';

import { useCartStore } from '@/store/useCartStore';

const productA = {
  id: 1,
  title: 'Product A',
  price: 10,
  thumbnail: 'https://cdn.dummyjson.com/a.webp',
};

const productB = {
  id: 2,
  title: 'Product B',
  price: 5.5,
  thumbnail: 'https://cdn.dummyjson.com/b.webp',
};

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    window.localStorage.clear();
  });

  it('adds a new item with quantity 1', () => {
    useCartStore.getState().addItem(productA);

    expect(useCartStore.getState().items).toEqual([
      { ...productA, quantity: 1 },
    ]);
    expect(useCartStore.getState().totalItems()).toBe(1);
    expect(useCartStore.getState().totalPrice()).toBe(10);
  });

  it('increments quantity when adding an existing item', () => {
    const { addItem } = useCartStore.getState();
    addItem(productA);
    addItem(productA);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]?.quantity).toBe(2);
    expect(useCartStore.getState().totalItems()).toBe(2);
    expect(useCartStore.getState().totalPrice()).toBe(20);
  });

  it('removes an item entirely', () => {
    const store = useCartStore.getState();
    store.addItem(productA);
    store.addItem(productB);
    store.removeItem(productA.id);

    expect(useCartStore.getState().items).toEqual([
      { ...productB, quantity: 1 },
    ]);
  });

  it('updates quantity for an existing item', () => {
    useCartStore.getState().addItem(productA);
    useCartStore.getState().updateQuantity(productA.id, 3);

    expect(useCartStore.getState().items[0]?.quantity).toBe(3);
    expect(useCartStore.getState().totalItems()).toBe(3);
    expect(useCartStore.getState().totalPrice()).toBe(30);
  });

  it('removes an item when quantity is updated below 1', () => {
    useCartStore.getState().addItem(productA);
    useCartStore.getState().updateQuantity(productA.id, 0);

    expect(useCartStore.getState().items).toEqual([]);
  });

  it('clears the cart', () => {
    const store = useCartStore.getState();
    store.addItem(productA);
    store.addItem(productB);
    store.clearCart();

    expect(useCartStore.getState().items).toEqual([]);
    expect(useCartStore.getState().totalItems()).toBe(0);
    expect(useCartStore.getState().totalPrice()).toBe(0);
  });

  it('calculates totals across multiple lines', () => {
    const store = useCartStore.getState();
    store.addItem(productA);
    store.addItem(productA);
    store.addItem(productB);

    expect(store.totalItems()).toBe(3);
    expect(store.totalPrice()).toBe(25.5);
  });
});
