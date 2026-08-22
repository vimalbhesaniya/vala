"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

export function isAdminRole(role?: string | null) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function useAdminAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    return useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
  }, []);

  const isAdmin = isAdminRole(user?.role);

  return {
    user,
    token,
    hydrated,
    isAdmin,
    isAuthenticated: !!token && isAdmin,
    isReady: hydrated,
  };
}
