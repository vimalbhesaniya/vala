"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchStore {
  recentSearches: string[];
  addSearch: (query: string) => void;
  clearSearches: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      addSearch: (query) => {
        const q = query.trim();
        if (!q) return;
        const filtered = get().recentSearches.filter(
          (s) => s.toLowerCase() !== q.toLowerCase()
        );
        set({ recentSearches: [q, ...filtered].slice(0, 8) });
      },
      clearSearches: () => set({ recentSearches: [] }),
    }),
    { name: "vala-recent-searches" }
  )
);
