"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("vala-token", token);
        }
        set({ user, token });
      },

      setUser: (user) => set({ user }),

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("vala-token");
        }
        set({ user: null, token: null });
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: "vala-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && typeof window !== "undefined") {
          localStorage.setItem("vala-token", state.token);
        }
      },
    }
  )
);
