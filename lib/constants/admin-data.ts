import type { OrderStatus } from "@/types/order";

export type RevenuePeriod = "7d" | "30d" | "90d" | "3m" | "6m" | "1y";

export interface AdminDashboardStat {
  id: string;
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrderStatusCount {
  status: OrderStatus;
  label: string;
  count: number;
  color: string;
}

export interface TopProduct {
  id: string;
  name: string;
  schoolName: string;
  unitsSold: number;
  revenue: number;
  image: string;
}

export interface TopSchool {
  id: string;
  name: string;
  city: string;
  orders: number;
  revenue: number;
  logo: string;
}

export interface LowStockItem {
  id: string;
  productName: string;
  sku: string;
  size: string;
  schoolName: string;
  stock: number;
  threshold: number;
}

export interface AdminRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  schoolName: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  itemCount: number;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  totalSpent: number;
  lastOrderAt: string;
  status: "active" | "inactive";
}

export interface AdminCoupon {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrder: number;
  usageCount: number;
  usageLimit: number;
  status: "active" | "expired" | "scheduled";
  expiresAt: string;
}

export interface AdminBanner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  placement: "homepage_hero" | "homepage_mid" | "announcement";
  status: "active" | "draft" | "scheduled";
  startsAt: string;
  endsAt?: string;
}

export interface InventoryRow {
  id: string;
  productName: string;
  sku: string;
  schoolName: string;
  category: string;
  size: string;
  stock: number;
  reserved: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  lastUpdated: string;
}

export const ADMIN_DASHBOARD_STATS: AdminDashboardStat[] = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "₹12,48,560",
    change: 14.2,
    changeLabel: "vs last month",
  },
  {
    id: "orders",
    label: "Total Orders",
    value: "1,284",
    change: 8.6,
    changeLabel: "vs last month",
  },
  {
    id: "customers",
    label: "Active Customers",
    value: "892",
    change: 5.3,
    changeLabel: "vs last month",
  },
  {
    id: "avg-order",
    label: "Avg. Order Value",
    value: "₹972",
    change: -2.1,
    changeLabel: "vs last month",
  },
];

function generateRevenueSeries(
  days: number,
  baseRevenue: number,
  variance: number
): RevenueDataPoint[] {
  const points: RevenueDataPoint[] = [];
  const now = new Date("2026-08-22");

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const weekdayBoost = [0, 6].includes(date.getDay()) ? 1.15 : 1;
    const noise = 0.85 + (((i * 17 + days) % 30) / 100);
    const revenue = Math.round(baseRevenue * weekdayBoost * noise * variance);
    const orders = Math.round(revenue / (850 + ((i * 7) % 200)));

    points.push({
      date: date.toISOString().split("T")[0],
      revenue,
      orders,
    });
  }

  return points;
}

export const ADMIN_REVENUE_DATA: Record<RevenuePeriod, RevenueDataPoint[]> = {
  "7d": generateRevenueSeries(7, 42000, 1),
  "30d": generateRevenueSeries(30, 38000, 1),
  "90d": generateRevenueSeries(90, 35000, 1),
  "3m": generateRevenueSeries(90, 36000, 1.05),
  "6m": generateRevenueSeries(180, 34000, 1.08),
  "1y": generateRevenueSeries(365, 32000, 1.12),
};

export const ADMIN_ORDER_STATUS_COUNTS: OrderStatusCount[] = [
  { status: "pending", label: "Pending", count: 24, color: "#737373" },
  { status: "confirmed", label: "Confirmed", count: 18, color: "#C89B5A" },
  { status: "processing", label: "Processing", count: 32, color: "#C89B5A" },
  { status: "packed", label: "Packed", count: 15, color: "#111111" },
  { status: "shipped", label: "Shipped", count: 41, color: "#111111" },
  { status: "delivered", label: "Delivered", count: 1089, color: "#2E7D32" },
  { status: "cancelled", label: "Cancelled", count: 47, color: "#D32F2F" },
  { status: "returned", label: "Returned", count: 18, color: "#D32F2F" },
];

export const ADMIN_TOP_PRODUCTS: TopProduct[] = [
  {
    id: "prod-1",
    name: "Boys Formal Shirt — White",
    schoolName: "Oakridge International",
    unitsSold: 342,
    revenue: 513000,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b68?w=200&q=80",
  },
  {
    id: "prod-2",
    name: "Girls Pleated Skirt — Navy",
    schoolName: "Greenfield Academy",
    unitsSold: 298,
    revenue: 357600,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=200&q=80",
  },
  {
    id: "prod-3",
    name: "Boys Trousers — Grey",
    schoolName: "Brightwood Public School",
    unitsSold: 276,
    revenue: 386400,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&q=80",
  },
  {
    id: "prod-4",
    name: "School Tie — Striped",
    schoolName: "Riverdale International",
    unitsSold: 241,
    revenue: 96400,
    image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=200&q=80",
  },
  {
    id: "prod-5",
    name: "Sports T-Shirt — House Colours",
    schoolName: "Starlight Academy",
    unitsSold: 218,
    revenue: 174400,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80",
  },
];

export const ADMIN_TOP_SCHOOLS: TopSchool[] = [
  {
    id: "sch-1",
    name: "Oakridge International School",
    city: "Hyderabad",
    orders: 412,
    revenue: 487600,
    logo: "/images/schools/oakridge.svg",
  },
  {
    id: "sch-2",
    name: "Greenfield Academy",
    city: "Bangalore",
    orders: 328,
    revenue: 392400,
    logo: "/images/schools/greenfield.svg",
  },
  {
    id: "sch-3",
    name: "Brightwood Public School",
    city: "Pune",
    orders: 296,
    revenue: 341800,
    logo: "/images/schools/brightwood.svg",
  },
  {
    id: "sch-4",
    name: "Riverdale International School",
    city: "Mumbai",
    orders: 248,
    revenue: 298600,
    logo: "/images/schools/riverdale.svg",
  },
  {
    id: "sch-5",
    name: "Starlight Academy",
    city: "Chennai",
    orders: 189,
    revenue: 218400,
    logo: "/images/schools/starlight.svg",
  },
];

export const ADMIN_LOW_STOCK_ITEMS: LowStockItem[] = [
  {
    id: "ls-1",
    productName: "Boys Formal Shirt — White",
    sku: "OAK-SHT-WHT-32",
    size: "32",
    schoolName: "Oakridge International",
    stock: 3,
    threshold: 10,
  },
  {
    id: "ls-2",
    productName: "Girls Pleated Skirt — Navy",
    sku: "GRN-SKT-NVY-M",
    size: "M",
    schoolName: "Greenfield Academy",
    stock: 5,
    threshold: 12,
  },
  {
    id: "ls-3",
    productName: "Black School Shoes",
    sku: "BRW-SHO-BLK-5",
    size: "5",
    schoolName: "Brightwood Public School",
    stock: 2,
    threshold: 8,
  },
  {
    id: "ls-4",
    productName: "House Sports Jersey",
    sku: "STL-SPT-RED-L",
    size: "L",
    schoolName: "Starlight Academy",
    stock: 4,
    threshold: 15,
  },
  {
    id: "ls-5",
    productName: "School Belt — Brown",
    sku: "RIV-BLT-BRN-28",
    size: "28",
    schoolName: "Riverdale International",
    stock: 6,
    threshold: 10,
  },
];

export const ADMIN_RECENT_ORDERS: AdminRecentOrder[] = [
  {
    id: "ord-1",
    orderNumber: "VALA-20260822-1042",
    customerName: "Priya Sharma",
    schoolName: "Oakridge International",
    total: 2847,
    status: "processing",
    createdAt: "2026-08-22T09:14:00Z",
    itemCount: 4,
  },
  {
    id: "ord-2",
    orderNumber: "VALA-20260822-1041",
    customerName: "Rajesh Kumar",
    schoolName: "Greenfield Academy",
    total: 1599,
    status: "confirmed",
    createdAt: "2026-08-22T08:52:00Z",
    itemCount: 2,
  },
  {
    id: "ord-3",
    orderNumber: "VALA-20260821-1039",
    customerName: "Ananya Reddy",
    schoolName: "Brightwood Public School",
    total: 4299,
    status: "shipped",
    createdAt: "2026-08-21T18:30:00Z",
    itemCount: 6,
  },
  {
    id: "ord-4",
    orderNumber: "VALA-20260821-1037",
    customerName: "Vikram Patel",
    schoolName: "Riverdale International",
    total: 987,
    status: "delivered",
    createdAt: "2026-08-21T15:08:00Z",
    itemCount: 1,
  },
  {
    id: "ord-5",
    orderNumber: "VALA-20260821-1035",
    customerName: "Meera Iyer",
    schoolName: "Starlight Academy",
    total: 3648,
    status: "packed",
    createdAt: "2026-08-21T12:45:00Z",
    itemCount: 5,
  },
  {
    id: "ord-6",
    orderNumber: "VALA-20260820-1031",
    customerName: "Arjun Menon",
    schoolName: "Oakridge International",
    total: 2199,
    status: "cancelled",
    createdAt: "2026-08-20T20:12:00Z",
    itemCount: 3,
  },
];

export const ADMIN_CUSTOMERS: AdminCustomer[] = [
  {
    id: "cust-1",
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    phone: "+91 98765 43210",
    city: "Hyderabad",
    orders: 8,
    totalSpent: 18420,
    lastOrderAt: "2026-08-22T09:14:00Z",
    status: "active",
  },
  {
    id: "cust-2",
    name: "Rajesh Kumar",
    email: "rajesh.k@outlook.com",
    phone: "+91 87654 32109",
    city: "Bangalore",
    orders: 5,
    totalSpent: 9870,
    lastOrderAt: "2026-08-22T08:52:00Z",
    status: "active",
  },
  {
    id: "cust-3",
    name: "Ananya Reddy",
    email: "ananya.reddy@yahoo.com",
    phone: "+91 76543 21098",
    city: "Pune",
    orders: 12,
    totalSpent: 32150,
    lastOrderAt: "2026-08-21T18:30:00Z",
    status: "active",
  },
  {
    id: "cust-4",
    name: "Vikram Patel",
    email: "vikram.patel@gmail.com",
    phone: "+91 65432 10987",
    city: "Mumbai",
    orders: 3,
    totalSpent: 4520,
    lastOrderAt: "2026-08-21T15:08:00Z",
    status: "active",
  },
  {
    id: "cust-5",
    name: "Meera Iyer",
    email: "meera.iyer@hotmail.com",
    phone: "+91 54321 09876",
    city: "Chennai",
    orders: 6,
    totalSpent: 14890,
    lastOrderAt: "2026-08-21T12:45:00Z",
    status: "active",
  },
  {
    id: "cust-6",
    name: "Suresh Nair",
    email: "suresh.nair@gmail.com",
    phone: "+91 43210 98765",
    city: "Kochi",
    orders: 1,
    totalSpent: 1299,
    lastOrderAt: "2026-05-14T10:22:00Z",
    status: "inactive",
  },
];

export const ADMIN_COUPONS: AdminCoupon[] = [
  {
    id: "cpn-1",
    code: "BACK2SCHOOL",
    description: "Back to school season discount",
    discountType: "percentage",
    discountValue: 15,
    minOrder: 1499,
    usageCount: 142,
    usageLimit: 500,
    status: "active",
    expiresAt: "2026-09-30T23:59:59Z",
  },
  {
    id: "cpn-2",
    code: "FIRST100",
    description: "First order flat discount",
    discountType: "fixed",
    discountValue: 100,
    minOrder: 999,
    usageCount: 89,
    usageLimit: 200,
    status: "active",
    expiresAt: "2026-12-31T23:59:59Z",
  },
  {
    id: "cpn-3",
    code: "UNIFORMSET",
    description: "Complete uniform set bundle offer",
    discountType: "percentage",
    discountValue: 20,
    minOrder: 2999,
    usageCount: 34,
    usageLimit: 100,
    status: "active",
    expiresAt: "2026-10-15T23:59:59Z",
  },
  {
    id: "cpn-4",
    code: "DIWALI2025",
    description: "Festive season sale",
    discountType: "percentage",
    discountValue: 10,
    minOrder: 799,
    usageCount: 256,
    usageLimit: 256,
    status: "expired",
    expiresAt: "2025-11-15T23:59:59Z",
  },
  {
    id: "cpn-5",
    code: "NEWYEAR26",
    description: "New year launch offer",
    discountType: "fixed",
    discountValue: 150,
    minOrder: 1999,
    usageCount: 0,
    usageLimit: 300,
    status: "scheduled",
    expiresAt: "2027-01-15T23:59:59Z",
  },
];

export const ADMIN_BANNERS: AdminBanner[] = [
  {
    id: "bnr-1",
    title: "Back to School Collection",
    subtitle: "Up to 20% off on complete uniform sets",
    cta: "Shop Now",
    href: "/shop",
    placement: "homepage_hero",
    status: "active",
    startsAt: "2026-08-01T00:00:00Z",
    endsAt: "2026-09-30T23:59:59Z",
  },
  {
    id: "bnr-2",
    title: "Free Delivery Above ₹999",
    subtitle: "On all orders across India",
    cta: "Learn More",
    href: "/shipping",
    placement: "announcement",
    status: "active",
    startsAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "bnr-3",
    title: "Sports Week Special",
    subtitle: "House colour jerseys now available",
    cta: "Explore Sports",
    href: "/categories/sports",
    placement: "homepage_mid",
    status: "scheduled",
    startsAt: "2026-09-01T00:00:00Z",
    endsAt: "2026-09-15T23:59:59Z",
  },
  {
    id: "bnr-4",
    title: "Size Exchange Guarantee",
    subtitle: "Easy exchanges within 15 days",
    cta: "View Policy",
    href: "/returns",
    placement: "homepage_mid",
    status: "draft",
    startsAt: "2026-10-01T00:00:00Z",
  },
];

export const ADMIN_INVENTORY_ROWS: InventoryRow[] = [
  {
    id: "inv-1",
    productName: "Boys Formal Shirt — White",
    sku: "OAK-SHT-WHT-32",
    schoolName: "Oakridge International",
    category: "Shirts",
    size: "32",
    stock: 3,
    reserved: 2,
    status: "low_stock",
    lastUpdated: "2026-08-22T08:00:00Z",
  },
  {
    id: "inv-2",
    productName: "Boys Formal Shirt — White",
    sku: "OAK-SHT-WHT-34",
    schoolName: "Oakridge International",
    category: "Shirts",
    size: "34",
    stock: 48,
    reserved: 5,
    status: "in_stock",
    lastUpdated: "2026-08-22T08:00:00Z",
  },
  {
    id: "inv-3",
    productName: "Girls Pleated Skirt — Navy",
    sku: "GRN-SKT-NVY-S",
    schoolName: "Greenfield Academy",
    category: "Skirts",
    size: "S",
    stock: 0,
    reserved: 0,
    status: "out_of_stock",
    lastUpdated: "2026-08-21T16:30:00Z",
  },
  {
    id: "inv-4",
    productName: "Girls Pleated Skirt — Navy",
    sku: "GRN-SKT-NVY-M",
    schoolName: "Greenfield Academy",
    category: "Skirts",
    size: "M",
    stock: 5,
    reserved: 3,
    status: "low_stock",
    lastUpdated: "2026-08-22T07:45:00Z",
  },
  {
    id: "inv-5",
    productName: "Boys Trousers — Grey",
    sku: "BRW-TRS-GRY-30",
    schoolName: "Brightwood Public School",
    category: "Trousers",
    size: "30",
    stock: 62,
    reserved: 4,
    status: "in_stock",
    lastUpdated: "2026-08-22T06:15:00Z",
  },
  {
    id: "inv-6",
    productName: "Black School Shoes",
    sku: "BRW-SHO-BLK-5",
    schoolName: "Brightwood Public School",
    category: "Shoes",
    size: "5",
    stock: 2,
    reserved: 1,
    status: "low_stock",
    lastUpdated: "2026-08-21T22:00:00Z",
  },
  {
    id: "inv-7",
    productName: "School Tie — Striped",
    sku: "RIV-TIE-STR-OS",
    schoolName: "Riverdale International",
    category: "Ties",
    size: "One Size",
    stock: 156,
    reserved: 8,
    status: "in_stock",
    lastUpdated: "2026-08-20T14:00:00Z",
  },
  {
    id: "inv-8",
    productName: "House Sports Jersey",
    sku: "STL-SPT-RED-L",
    schoolName: "Starlight Academy",
    category: "Sports",
    size: "L",
    stock: 4,
    reserved: 2,
    status: "low_stock",
    lastUpdated: "2026-08-22T09:30:00Z",
  },
];
