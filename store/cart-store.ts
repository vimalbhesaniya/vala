"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  lastAddedItem: CartItem | null;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      lastAddedItem: null,

      addItem: (item) => {
        const id = `${item.productId}-${item.size}-${item.color}`;
        const existing = get().items.find((i) => i.id === id);
        let newItem: CartItem;

        if (existing) {
          newItem = { ...existing, quantity: existing.quantity + item.quantity };
          set({
            items: get().items.map((i) => (i.id === id ? newItem : i)),
            lastAddedItem: newItem,
            isDrawerOpen: true,
          });
        } else {
          newItem = { ...item, id };
          set({
            items: [...get().items, newItem],
            lastAddedItem: newItem,
            isDrawerOpen: true,
          });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [], lastAddedItem: null }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "vala-cart" }
  )
);
