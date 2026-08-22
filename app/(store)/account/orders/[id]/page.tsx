"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { OrderTimeline } from "@/components/account/OrderTimeline";
import { EmptyState } from "@/components/common/EmptyState";
import { useAuthStore } from "@/store/auth-store";
import { useOrder } from "@/hooks/use-api";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { formatPrice } from "@/lib/utils/format";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { token } = useAuthStore();
  const isAuth = !!token;
  const { data: order, isLoading, isError } = useOrder(id, isAuth);

  if (!isAuth) {
    return (
      <div>
        <PageHeader title="Order Details" description="Sign in to view this order." />
        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="text-sm text-muted">Sign in to view order details.</p>
          <Link href="/account/profile" className="mt-4 inline-block">
            <Button variant="primary" size="sm">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Order Details" description="Loading order..." />
        <div className="h-64 animate-pulse rounded-2xl bg-border/40" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div>
        <PageHeader title="Order Not Found" />
        <EmptyState
          title="Order not found"
          description="This order may not exist or you don't have access."
          actionLabel="Back to Orders"
          actionHref="/account/orders"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed on ${order.createdAt}`}
      >
        <Link href="/account/orders">
          <Button variant="outline" size="sm">← Back to Orders</Button>
        </Link>
      </PageHeader>

      <div className="mb-6 inline-flex rounded-full border border-border px-4 py-1.5 text-xs font-medium">
        Status: {ORDER_STATUS_LABELS[order.status]}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold text-primary">Delivery Timeline</h2>
          <div className="mt-6">
            <OrderTimeline status={order.status} />
          </div>
          {order.estimatedDelivery && (
            <p className="mt-4 text-xs text-muted">
              Estimated delivery: {order.estimatedDelivery}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-sm font-semibold text-primary">Shipping Address</h2>
          <address className="mt-4 not-italic text-sm text-muted">
            <p className="font-medium text-foreground">{order.address.name}</p>
            <p className="mt-1">{order.address.line1}</p>
            {order.address.line2 && <p>{order.address.line2}</p>}
            <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
            <p className="mt-1">{order.address.phone}</p>
          </address>

          <dl className="mt-6 space-y-2 border-t border-border pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>Discount</dt>
                <dd>-{formatPrice(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Tax</dt>
              <dd>{formatPrice(order.tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-sm font-semibold text-primary">Items</h2>
        <ul className="mt-4 divide-y divide-border">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.size}`} className="flex gap-4 py-4 first:pt-0">
              <Link
                href={`/products/${item.productSlug}`}
                className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f0efec]"
              >
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/products/${item.productSlug}`}>
                  <p className="text-sm font-medium hover:text-accent">{item.name}</p>
                </Link>
                <p className="text-xs text-muted">{item.schoolName}</p>
                <p className="text-xs text-muted">Size {item.size} · Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6">
        <Link href="/track-order">
          <Button variant="outline" size="sm">Track This Order</Button>
        </Link>
      </div>
    </div>
  );
}
