"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { OrderTimeline } from "@/components/account/OrderTimeline";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { AdminTableStatusBadge } from "@/components/admin/AdminTable";
import { Button } from "@/components/common/Button";
import { PageHeader } from "@/components/common/PageHeader";
import { AdminScrollPage } from "@/components/admin/AdminGridPage";
import {
  ADMIN_STATUS_ACTIONS,
  ORDER_STATUS_TABLE_CONFIG,
} from "@/lib/admin/orders";
import { useOrder, useOrderMutations } from "@/hooks/use-api";
import { useToast } from "@/components/providers/toast-provider";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/order";
import { formatPrice } from "@/lib/utils/format";

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: order, isLoading } = useOrder(id);
  const { updateStatus, deleteOrder } = useOrderMutations();
  const { toast } = useToast();

  const [confirmAction, setConfirmAction] = useState<{
    label: string;
    nextStatus: OrderStatus;
    variant: "danger" | "default";
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-border/40" />;
  }

  if (!order) notFound();

  const actions = ADMIN_STATUS_ACTIONS[order.status];

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    updateStatus.mutate(
      { id: order.id, status: confirmAction.nextStatus },
      {
        onSuccess: () => {
          toast(`Order status updated to ${ORDER_STATUS_LABELS[confirmAction.nextStatus]}`);
          setConfirmAction(null);
        },
        onError: (err) => toast(err.message),
      }
    );
  };

  return (
    <AdminScrollPage>
    <div>
      <PageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed on ${order.createdAt} · ${order.customerName}`}
      >
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            ← Back to Orders
          </Button>
        </Link>
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <AdminTableStatusBadge status={order.status} config={ORDER_STATUS_TABLE_CONFIG} />
        <span className="text-xs text-muted">
          Payment: {order.paymentStatus} · {order.paymentMethod.toUpperCase()}
        </span>
      </div>

      {actions.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant === "danger" ? "outline" : "secondary"}
              size="sm"
              onClick={() =>
                setConfirmAction({
                  label: action.label,
                  nextStatus: action.nextStatus,
                  variant: action.variant ?? "default",
                })
              }
            >
              {action.label}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="text-error hover:border-error hover:text-error"
            onClick={() => setConfirmDelete(true)}
          >
            Delete Order
          </Button>
        </div>
      )}

      {actions.length === 0 && (
        <div className="mb-8">
          <Button
            variant="outline"
            size="sm"
            className="text-error hover:border-error hover:text-error"
            onClick={() => setConfirmDelete(true)}
          >
            Delete Order
          </Button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-primary">Order Timeline</h2>
          <div className="mt-6">
            <OrderTimeline status={order.status} />
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-primary">Customer & Shipping</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">Customer</dt>
              <dd className="font-medium text-primary">{order.customerName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">Email</dt>
              <dd className="text-muted">{order.customerEmail}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted">Phone</dt>
              <dd className="text-muted">{order.customerPhone}</dd>
            </div>
          </dl>
          <address className="mt-6 not-italic border-t border-border pt-6 text-sm text-muted">
            <p className="font-medium text-primary">{order.address.name}</p>
            <p className="mt-1">{order.address.line1}</p>
            {order.address.line2 && <p>{order.address.line2}</p>}
            <p>
              {order.address.city}, {order.address.state} — {order.address.pincode}
            </p>
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

      <section className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-sm font-semibold text-primary">Order Items</h2>
        <ul className="mt-4 divide-y divide-border">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.size}`} className="flex gap-4 py-4 first:pt-0">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f0efec]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-primary">{item.name}</p>
                <p className="text-xs text-muted">{item.schoolName}</p>
                <p className="text-xs text-muted">
                  Size {item.size} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
      </section>

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={confirmAction?.label ?? "Confirm Action"}
        description={`Are you sure you want to update this order to "${confirmAction ? ORDER_STATUS_LABELS[confirmAction.nextStatus] : ""}"?`}
        confirmLabel={confirmAction?.label ?? "Confirm"}
        variant={confirmAction?.variant === "danger" ? "danger" : "default"}
      />

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          deleteOrder.mutate(order.id, {
            onSuccess: () => {
              toast(`Order ${order.orderNumber} deleted`);
              router.push("/admin/orders");
            },
            onError: (err) => toast(err.message),
          });
          setConfirmDelete(false);
        }}
        title="Delete Order"
        description={`Permanently delete order "${order.orderNumber}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteOrder.isPending}
      />
    </div>
    </AdminScrollPage>
  );
}
