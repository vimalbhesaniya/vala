"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentlyViewedStore {
  productSlugs: string[];
  add: (productSlug: string) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      productSlugs: [],
      add: (productSlug) => {
        const filtered = get().productSlugs.filter((slug) => slug !== productSlug);
        set({ productSlugs: [productSlug, ...filtered].slice(0, 8) });
      },
    }),
    { name: "vala-recently-viewed" }
  )
);
