"use client";

import { formatPrice } from "@/lib/utils/format";
import { useSiteSettings } from "@/hooks/use-site-config";
import { computeCartTotals } from "@/lib/site-config";
import { cn } from "@/lib/utils/cn";

interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  shipping?: number;
  tax?: number;
  showDeliveryProgress?: boolean;
  className?: string;
}

export function CartSummary({
  subtotal,
  discount = 0,
  shipping,
  tax,
  showDeliveryProgress = true,
  className,
}: CartSummaryProps) {
  const { data: settings } = useSiteSettings();
  const freeThreshold = settings?.shipping.freeThreshold ?? 999;
  const totals = settings
    ? computeCartTotals(subtotal, settings, discount)
    : { shipping: subtotal >= 999 ? 0 : 99, tax: Math.round(subtotal * 0.05), total: 0 };

  const computedShipping = shipping ?? totals.shipping;
  const computedTax = tax ?? totals.tax;
  const total = subtotal - discount + computedShipping + computedTax;
  const remaining = freeThreshold - subtotal;
  const progress = Math.min(100, (subtotal / freeThreshold) * 100);

  return (
    <div className={cn("rounded-2xl border border-border bg-surface p-6", className)}>
      {showDeliveryProgress && subtotal > 0 && (
        <div className="mb-6">
          {remaining > 0 ? (
            <p className="text-xs text-muted">
              You&apos;re{" "}
              <span className="font-medium text-foreground">{formatPrice(remaining)}</span> away
              from free delivery
            </p>
          ) : (
            <p className="text-xs font-medium text-success">You qualify for free delivery!</p>
          )}
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <dt>Discount</dt>
            <dd>-{formatPrice(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd>{computedShipping === 0 ? "Free" : formatPrice(computedShipping)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Tax</dt>
          <dd>{formatPrice(computedTax)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function getCartTotals(
  subtotal: number,
  discount = 0,
  settings?: import("@/types/site-settings").SiteSettings,
  deliveryMethod: "standard" | "express" = "standard"
) {
  if (settings) {
    return computeCartTotals(subtotal, settings, discount, deliveryMethod);
  }
  const shipping =
    deliveryMethod === "express"
      ? 149
      : subtotal >= 999
        ? 0
        : 99;
  const tax = Math.round(subtotal * 0.05);
  return { shipping, tax, total: subtotal - discount + shipping + tax };
}
