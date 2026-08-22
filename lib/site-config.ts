import type { SiteSettings } from "@/types/site-settings";

/** Client-safe cart total helpers — no Mongoose imports. */
export function computeCartTotals(
  subtotal: number,
  settings: SiteSettings,
  discount = 0,
  deliveryMethod: "standard" | "express" = "standard"
) {
  const { freeThreshold, standardRate, expressRate } = settings.shipping;
  const shipping =
    deliveryMethod === "express"
      ? expressRate
      : subtotal >= freeThreshold
        ? 0
        : standardRate;
  const tax = settings.tax.gstEnabled
    ? Math.round(subtotal * (settings.tax.gstRate / 100))
    : 0;
  const total = subtotal - discount + shipping + tax;
  return { shipping, tax, total };
}
