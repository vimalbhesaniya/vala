"use client";

import Link from "next/link";
import { Package, MapPin, Heart, User } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { useOrders, useAddresses } from "@/hooks/use-api";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuthStore } from "@/store/auth-store";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { formatPrice } from "@/lib/utils/format";

export default function AccountDashboardPage() {
  const { token, user } = useAuthStore();
  const isAuth = !!token;
  const { data: orders = [], isLoading: ordersLoading } = useOrders(isAuth);
  const { data: addresses = [] } = useAddresses(isAuth);
  const { productSlugs } = useWishlistStore();

  const displayName = user?.name?.split(" ")[0] ?? "there";
  const recentOrders = orders.slice(0, 3);

  return (
    <div>
      <PageHeader
        title={`Hello, ${displayName}`}
        description="Manage your orders, addresses, and wishlist."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Orders", value: isAuth ? orders.length : "—", icon: Package, href: "/account/orders" },
          { label: "Wishlist", value: productSlugs.length, icon: Heart, href: "/account/wishlist" },
          { label: "Addresses", value: isAuth ? addresses.length : "—", icon: MapPin, href: "/account/addresses" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary/20"
          >
            <stat.icon className="h-5 w-5 text-accent" />
            <p className="mt-3 text-2xl font-semibold text-primary">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-primary">Recent Orders</h2>
          <Link href="/account/orders" className="text-xs text-accent hover:underline">
            View all
          </Link>
        </div>

        {!isAuth ? (
          <p className="mt-4 text-sm text-muted">
            <Link href="/account/profile" className="text-accent hover:underline">
              Sign in
            </Link>{" "}
            to view your orders.
          </p>
        ) : ordersLoading ? (
          <div className="mt-4 h-24 animate-pulse rounded-xl bg-border/40" />
        ) : recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No orders yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/20"
              >
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-muted">
                    {order.createdAt} · {ORDER_STATUS_LABELS[order.status]}
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/account/profile">
          <Button variant="outline" size="sm">
            <User className="h-4 w-4" />
            Edit Profile
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="primary" size="sm">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
