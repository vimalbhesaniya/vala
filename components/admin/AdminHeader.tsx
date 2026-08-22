"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, Menu, User } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils/cn";

export interface AdminBreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminHeaderProps {
  breadcrumbs: AdminBreadcrumbItem[];
  title: string;
  onMenuClick?: () => void;
  className?: string;
}

export function AdminHeader({
  breadcrumbs,
  title,
  onMenuClick,
  className,
}: AdminHeaderProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    setMenuOpen(false);
    router.replace("/admin/login");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary hover:bg-primary/5 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <div className="min-w-0">
            <Breadcrumb items={breadcrumbs} />
            <h1 className="mt-0.5 truncate text-lg font-semibold text-primary sm:text-xl">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary/5 hover:text-primary"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 transition-colors hover:bg-primary/5"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="hidden text-sm font-medium text-primary sm:inline">
                {user?.name?.split(" ")[0] ?? "Admin"}
              </span>
              <ChevronDown
                className={cn(
                  "hidden h-4 w-4 text-muted transition-transform sm:block",
                  menuOpen && "rotate-180"
                )}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-border bg-surface py-1 shadow-elevated">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-medium text-primary">{user?.name ?? "Admin"}</p>
                  <p className="text-xs text-muted">{user?.email ?? "admin@vala.com"}</p>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full px-4 py-2.5 text-left text-sm text-error hover:bg-error/5"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
