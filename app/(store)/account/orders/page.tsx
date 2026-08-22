"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/common/Button";
import { useAuthStore } from "@/store/auth-store";
import { useOrders } from "@/hooks/use-api";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/order";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const STATUS_FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  const { token } = useAuthStore();
  const isAuth = !!token;
  const { data: orders = [], isLoading, isError } = useOrders(isAuth);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(
    () =>
      statusFilter === "all"
        ? orders
        : orders.filter((o) => o.status === statusFilter),
    [orders, statusFilter]
  );

  if (!isAuth) {
    return (
      <div>
        <PageHeader title="Orders" description="View and track your order history." />
        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="text-sm text-muted">Sign in to view your orders.</p>
          <Link href="/account/profile" className="mt-4 inline-block">
            <Button variant="primary" size="sm">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Orders" description="View and track your order history." />

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
              statusFilter === f.value
                ? "border-primary bg-primary text-white"
                : "border-border text-muted hover:border-primary/30"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-border/40" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Unable to load orders"
          description="Please try again in a moment."
          actionLabel="Refresh"
          actionHref="/account/orders"
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Orders matching this filter will appear here."
          actionLabel="Start Shopping"
          actionHref="/shop"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-primary">{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-muted">
                    {order.createdAt} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                  <p className="mt-1 text-xs text-muted">{ORDER_STATUS_LABELS[order.status]}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
