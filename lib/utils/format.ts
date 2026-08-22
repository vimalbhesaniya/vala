export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscount(price: number, comparePrice: number): number {
  if (comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}
