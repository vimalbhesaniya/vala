"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Button } from "@/components/common/Button";
import { useAuthStore } from "@/store/auth-store";
import { ordersApi } from "@/lib/api/services";
import { formatPrice } from "@/lib/utils/format";
import type { Order } from "@/types/order";

export function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") ?? "";
  const { token } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(!!orderNumber);

  useEffect(() => {
    async function loadOrder() {
      if (!orderNumber) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        if (token) {
          const list = await ordersApi.list();
          const found = list.data.find(
            (o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase()
          );
          if (found) {
            setOrder(found);
            return;
          }
        }

        const email =
          typeof window !== "undefined"
            ? sessionStorage.getItem("vala-last-order-email")
            : null;

        if (email) {
          const tracked = await ordersApi.track(orderNumber, email);
          setOrder(tracked.data);
        }
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderNumber, token]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Order Confirmed" },
        ]}
      />

      <div className="mt-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h1 className="mt-6 text-2xl font-medium text-primary sm:text-3xl">
          Thank You for Your Order!
        </h1>
        <p className="mt-3 text-sm text-muted">
          Your order has been placed successfully. We&apos;ll send you updates as it ships.
        </p>

        {orderNumber && (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6 text-left">
            <p className="text-xs tracking-wider text-muted uppercase">Order Number</p>
            <p className="mt-1 text-lg font-semibold text-primary">{orderNumber}</p>

            {loading ? (
              <div className="mt-6 h-20 animate-pulse rounded-lg bg-border/40" />
            ) : order ? (
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Total</dt>
                  <dd className="font-medium">{formatPrice(order.total)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Payment</dt>
                  <dd className="capitalize">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}
                  </dd>
                </div>
                {order.estimatedDelivery && (
                  <div className="flex justify-between">
                    <dt className="text-muted">Estimated Delivery</dt>
                    <dd>{order.estimatedDelivery}</dd>
                  </div>
                )}
              </dl>
            ) : null}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {order && (
            <Link href={`/account/orders/${order.id}`}>
              <Button variant="primary">
                <Package className="h-4 w-4" />
                View Order
              </Button>
            </Link>
          )}
          <Link href="/track-order">
            <Button variant="outline">Track Order</Button>
          </Link>
          <Link href="/shop">
            <Button variant="ghost">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
