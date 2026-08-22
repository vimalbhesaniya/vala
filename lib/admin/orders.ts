import { ADMIN_RECENT_ORDERS } from "@/lib/constants/admin-data";
import { DEMO_ORDERS, getDemoOrder } from "@/lib/constants/account-data";
import type { Order, OrderStatus } from "@/types/order";

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  schoolName: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  itemCount: number;
}

export const ORDER_STATUS_TABLE_CONFIG = [
  { value: "pending", label: "Pending", variant: "default" as const },
  { value: "confirmed", label: "Confirmed", variant: "accent" as const },
  { value: "processing", label: "Processing", variant: "accent" as const },
  { value: "packed", label: "Packed", variant: "default" as const },
  { value: "shipped", label: "Shipped", variant: "default" as const },
  { value: "out_for_delivery", label: "Out for Delivery", variant: "accent" as const },
  { value: "delivered", label: "Delivered", variant: "success" as const },
  { value: "cancelled", label: "Cancelled", variant: "sale" as const },
  { value: "returned", label: "Returned", variant: "sale" as const },
];

function adminRecentToOrder(recent: (typeof ADMIN_RECENT_ORDERS)[number]): Order {
  return {
    id: recent.id,
    orderNumber: recent.orderNumber,
    userId: "admin-mock",
    customerName: recent.customerName,
    customerEmail: `${recent.customerName.toLowerCase().replace(/\s+/g, ".")}@email.com`,
    customerPhone: "+91 90000 00000",
    items: [
      {
        productId: "mock",
        productSlug: "classic-white-cotton-shirt",
        name: `${recent.itemCount} item(s)`,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b68?w=200&q=80",
        schoolName: recent.schoolName,
        size: "—",
        quantity: recent.itemCount,
        price: Math.round(recent.total / recent.itemCount),
      },
    ],
    status: recent.status,
    paymentMethod: "cod",
    paymentStatus: recent.status === "delivered" ? "paid" : "pending",
    deliveryMethod: "standard",
    subtotal: recent.total,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: recent.total,
    address: {
      name: recent.customerName,
      line1: "Demo address line",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500001",
      phone: "+91 90000 00000",
    },
    createdAt: recent.createdAt.split("T")[0],
    estimatedDelivery: "3–5 business days",
  };
}

export function getAllAdminOrders(): AdminOrderRow[] {
  const fromDemo: AdminOrderRow[] = DEMO_ORDERS.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    schoolName: order.items[0]?.schoolName ?? "—",
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
  }));

  const demoIds = new Set(fromDemo.map((order) => order.id));
  const fromAdmin = ADMIN_RECENT_ORDERS.filter((order) => !demoIds.has(order.id));

  return [...fromAdmin, ...fromDemo].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getAdminOrderById(id: string): Order | null {
  const demo = getDemoOrder(id);
  if (demo) return demo;

  const recent = ADMIN_RECENT_ORDERS.find((order) => order.id === id);
  return recent ? adminRecentToOrder(recent) : null;
}

export const ADMIN_STATUS_ACTIONS: Record<
  OrderStatus,
  { label: string; nextStatus: OrderStatus; variant?: "danger" | "default" }[]
> = {
  pending: [{ label: "Confirm Order", nextStatus: "confirmed", variant: "default" }],
  confirmed: [
    { label: "Start Processing", nextStatus: "processing", variant: "default" },
    { label: "Cancel Order", nextStatus: "cancelled", variant: "danger" },
  ],
  processing: [
    { label: "Mark as Packed", nextStatus: "packed", variant: "default" },
    { label: "Cancel Order", nextStatus: "cancelled", variant: "danger" },
  ],
  packed: [{ label: "Mark as Shipped", nextStatus: "shipped", variant: "default" }],
  shipped: [{ label: "Mark Delivered", nextStatus: "delivered", variant: "default" }],
  out_for_delivery: [{ label: "Mark Delivered", nextStatus: "delivered", variant: "default" }],
  delivered: [{ label: "Mark Returned", nextStatus: "returned", variant: "danger" }],
  cancelled: [],
  returned: [],
};
