export const ANNOUNCEMENT_MESSAGE =
  "FREE DELIVERY ON ORDERS ABOVE ₹999";

export const FREE_DELIVERY_THRESHOLD = 999;

export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Schools", href: "/schools" },
  { label: "Boys", href: "/shop?gender=boys" },
  { label: "Girls", href: "/shop?gender=girls" },
  { label: "Sports", href: "/categories/sports" },
  { label: "Shoes", href: "/categories/shoes" },
  { label: "Accessories", href: "/categories/accessories" },
] as const;

export const WHY_VALA = [
  {
    title: "Premium Quality",
    description: "Made for everyday school life",
    icon: "sparkles" as const,
  },
  {
    title: "Perfect Fit",
    description: "Easy size selection",
    icon: "ruler" as const,
  },
  {
    title: "Easy Exchange",
    description: "Simple exchange process",
    icon: "refresh" as const,
  },
  {
    title: "Fast Delivery",
    description: "Reliable doorstep delivery",
    icon: "truck" as const,
  },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "Shop", href: "/shop" },
    { label: "Schools", href: "/schools" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  customerCare: [
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Track Order", href: "/account/orders" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
} as const;
