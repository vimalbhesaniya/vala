"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  productSlugs: string[];
  toggle: (slug: string) => void;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productSlugs: [],

      toggle: (slug) => {
        if (get().has(slug)) {
          get().remove(slug);
        } else {
          get().add(slug);
        }
      },

      add: (slug) =>
        set((s) => ({
          productSlugs: s.productSlugs.includes(slug)
            ? s.productSlugs
            : [...s.productSlugs, slug],
        })),

      remove: (slug) =>
        set((s) => ({
          productSlugs: s.productSlugs.filter((s) => s !== slug),
        })),

      has: (slug) => get().productSlugs.includes(slug),
    }),
    { name: "vala-wishlist" }
  )
);
