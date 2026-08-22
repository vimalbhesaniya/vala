export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentMethod = "cod" | "mock_online";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type DeliveryMethod = "standard" | "express";

export interface OrderItem {
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  schoolName: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryMethod: DeliveryMethod;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  address: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  createdAt: string;
  estimatedDelivery?: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export const ORDER_TIMELINE_STEPS: OrderStatus[] = [
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];
