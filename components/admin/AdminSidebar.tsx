"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  FolderTree,
  Image,
  LayoutDashboard,
  Package,
  PackageOpen,
  PanelLeftClose,
  PanelLeftOpen,
  School,
  Settings,
  ShoppingBag,
  Star,
  Ticket,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { Drawer } from "@/components/common/Drawer";
import { Tooltip } from "@/components/common/Tooltip";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { cn } from "@/lib/utils/cn";

const SIDEBAR_COLLAPSED_KEY = "vala-admin-sidebar-collapsed";

function usePersistedSidebarCollapsed() {
  const [collapsed, setCollapsedState] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
      if (stored !== null) setCollapsedState(stored === "true");
    } catch {
      // ignore storage errors
    }
  }, []);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(value));
    } catch {
      // ignore storage errors
    }
  }, []);

  return { collapsed, setCollapsed };
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Sales",
    items: [{ label: "Orders", href: "/admin/orders", icon: ShoppingBag }],
  },
  {
    title: "Catalog",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Schools", href: "/admin/schools", icon: School },
      { label: "Uniform Sets", href: "/admin/uniform-sets", icon: PackageOpen },
    ],
  },
  {
    title: "Inventory",
    items: [{ label: "Stock", href: "/admin/inventory", icon: Warehouse }],
  },
  {
    title: "Customers",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "Coupons", href: "/admin/coupons", icon: Ticket },
      { label: "Banners", href: "/admin/banners", icon: Image },
    ],
  },
  {
    title: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

const ROUTE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/orders": "Orders",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/schools": "Schools",
  "/admin/uniform-sets": "Uniform Sets",
  "/admin/inventory": "Stock",
  "/admin/customers": "Customers",
  "/admin/reviews": "Reviews",
  "/admin/coupons": "Coupons",
  "/admin/banners": "Banners",
  "/admin/settings": "Settings",
};

function isActiveRoute(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNav({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-3 py-4">
      {ADMIN_NAV_GROUPS.map((group) => (
        <div key={group.title}>
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted">
              {group.title}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActiveRoute(pathname, item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Tooltip
                    content={item.label}
                    subtitle={collapsed ? group.title : undefined}
                    side="right"
                    disabled={!collapsed}
                  >
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-white"
                          : "text-muted hover:bg-primary/5 hover:text-primary",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active ? "text-white" : "text-muted group-hover:text-primary"
                        )}
                      />
                      {!collapsed && <span>{item.label}</span>}
                      {active && !collapsed && (
                        <ChevronRight className="ml-auto h-4 w-4 opacity-60" />
                      )}
                    </Link>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({
  collapsed,
  onCollapsedChange,
  mobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "hidden h-screen shrink-0 flex-col overflow-hidden border-r border-border bg-surface transition-[width] duration-300 lg:flex",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-border px-4",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
                V
              </div>
              <div>
                <p className="text-sm font-semibold text-primary">VALA</p>
                <p className="text-[10px] uppercase tracking-widest text-muted">Admin</p>
              </div>
            </Link>
          )}
          {collapsed && (
            <Tooltip content="VALA Admin" subtitle="Dashboard" side="right">
              <Link
                href="/admin"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white"
              >
                V
              </Link>
            </Tooltip>
          )}
        </div>

        <SidebarNav collapsed={collapsed} />

        <div className="shrink-0 border-t border-border p-3">
          <Tooltip
            content={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            side="right"
            disabled={!collapsed}
          >
            <button
              type="button"
              onClick={() => onCollapsedChange(!collapsed)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-primary/5 hover:text-primary",
                collapsed && "justify-center px-2"
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <>
                  <PanelLeftClose className="h-4 w-4" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </Tooltip>
        </div>
      </aside>

      <Drawer
        open={mobileOpen}
        onClose={onMobileClose}
        side="left"
        className="flex h-full max-w-[280px] flex-col lg:hidden"
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <Link href="/admin" onClick={onMobileClose} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              V
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">VALA Admin</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onMobileClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-primary/5"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
          <SidebarNav collapsed={false} onNavigate={onMobileClose} />
        </div>
      </Drawer>
    </>
  );
}

export function getAdminPageMeta(pathname: string): {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
} {
  const matchedRoute =
    Object.keys(ROUTE_TITLES)
      .sort((a, b) => b.length - a.length)
      .find((route) => isActiveRoute(pathname, route)) ?? "/admin";

  const title = ROUTE_TITLES[matchedRoute] ?? "Admin";

  if (matchedRoute === "/admin") {
    return {
      title,
      breadcrumbs: [{ label: "Admin" }],
    };
  }

  return {
    title,
    breadcrumbs: [{ label: "Admin", href: "/admin" }, { label: title }],
  };
}

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const { collapsed, setCollapsed } = usePersistedSidebarCollapsed();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { title, breadcrumbs } = getAdminPageMeta(pathname);

  if (isLoginPage) {
    return <AdminAuthGuard>{children}</AdminAuthGuard>;
  }

  return (
    <AdminAuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <AdminHeader
            breadcrumbs={breadcrumbs}
            title={title}
            onMenuClick={() => setMobileOpen(true)}
          />
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
