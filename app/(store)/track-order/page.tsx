"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Package } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { OrderTimeline } from "@/components/account/OrderTimeline";
import { EmptyState } from "@/components/common/EmptyState";
import { ordersApi } from "@/lib/api/services";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { formatPrice } from "@/lib/utils/format";
import type { Order } from "@/types/order";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await ordersApi.track(orderNumber.trim(), email.trim());
      setResult(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Track Order" }]} />
      <PageHeader
        title="Track Your Order"
        description="Enter your order number and email to see delivery status."
      />

      <form
        onSubmit={handleTrack}
        className="rounded-2xl border border-border bg-surface p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="orderNumber" className="mb-2 block text-xs font-medium text-muted">
              Order Number
            </label>
            <Input
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. VALA-10248"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-medium text-muted">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya.mehta@email.com"
              required
            />
          </div>
        </div>
        <Button type="submit" variant="primary" className="mt-6 w-full sm:w-auto" disabled={loading}>
          <Search className="h-4 w-4" />
          {loading ? "Tracking..." : "Track Order"}
        </Button>
        <p className="mt-4 text-xs text-muted">
          Demo: use order <strong>VALA-10248</strong> with email <strong>priya.mehta@email.com</strong>
        </p>
      </form>

      {searched && !loading && !result && (
        <div className="mt-8">
          <EmptyState
            title="Order not found"
            description={error ?? "Please check your order number and email address."}
            actionLabel="Contact Support"
            actionHref="/contact"
          />
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-8">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted uppercase">Order {result.orderNumber}</p>
                <p className="mt-1 text-lg font-medium text-primary">
                  {ORDER_STATUS_LABELS[result.status]}
                </p>
                <p className="mt-1 text-sm text-muted">
                  Placed on {result.createdAt}
                  {result.estimatedDelivery && ` · Est. ${result.estimatedDelivery}`}
                </p>
              </div>
              {result.id && (
                <Link href={`/account/orders/${result.id}`}>
                  <Button variant="outline" size="sm">View Details</Button>
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-6 flex items-center gap-2 text-sm font-semibold text-primary">
              <Package className="h-4 w-4" />
              Delivery Timeline
            </h2>
            <OrderTimeline status={result.status} />
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold text-primary">Items</h2>
            <ul className="mt-4 divide-y divide-border">
              {result.items.map((item) => (
                <li key={item.productId} className="flex gap-4 py-4 first:pt-0">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-[#f0efec]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted">Size {item.size} · Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
