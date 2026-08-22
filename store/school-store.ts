"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { School } from "@/types/school";

interface SchoolState {
  selectedSchool: School | null;
  setSelectedSchool: (school: School | null) => void;
  clearSelectedSchool: () => void;
}

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set) => ({
      selectedSchool: null,
      setSelectedSchool: (school) => set({ selectedSchool: school }),
      clearSelectedSchool: () => set({ selectedSchool: null }),
    }),
    {
      name: "vala-selected-school",
    }
  )
);
