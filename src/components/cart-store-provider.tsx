'use client';

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';

import { useCartStore } from '@/store/useCartStore';
import type { CartItem, CartProductInput } from '@/types/cart';

type CartStoreTestApi = {
  getItems: () => CartItem[];
  addItem: (product: CartProductInput) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

declare global {
  interface Window {
    __CART_STORE__?: CartStoreTestApi;
  }
}

function shouldExposeCartStoreTestApi() {
  return (
    process.env.NEXT_PUBLIC_E2E === '1' ||
    process.env.NODE_ENV === 'development'
  );
}

function bindCartStoreTestApi() {
  window.__CART_STORE__ = {
    getItems: () => useCartStore.getState().items,
    addItem: (product) => useCartStore.getState().addItem(product),
    removeItem: (id) => useCartStore.getState().removeItem(id),
    updateQuantity: (id, quantity) =>
      useCartStore.getState().updateQuantity(id, quantity),
    clearCart: () => useCartStore.getState().clearCart(),
    totalItems: () => useCartStore.getState().totalItems(),
    totalPrice: () => useCartStore.getState().totalPrice(),
  };
}

export function useCartHasHydrated() {
  return useSyncExternalStore(
    (onStoreChange) => {
      return useCartStore.persist.onFinishHydration(() => {
        onStoreChange();
      });
    },
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}

type CartStoreProviderProps = {
  children: ReactNode;
};

export function CartStoreProvider({ children }: CartStoreProviderProps) {
  useEffect(() => {
    const exposeTestApi = shouldExposeCartStoreTestApi();

    const unsubFinish = useCartStore.persist.onFinishHydration(() => {
      if (exposeTestApi) {
        bindCartStoreTestApi();
      }
    });

    if (exposeTestApi && useCartStore.persist.hasHydrated()) {
      bindCartStoreTestApi();
    }

    const hydration = Promise.resolve(useCartStore.persist.rehydrate());

    void hydration.then(() => {
      if (exposeTestApi && useCartStore.persist.hasHydrated()) {
        bindCartStoreTestApi();
      }
    });

    return () => {
      unsubFinish();
    };
  }, []);

  return children;
}
