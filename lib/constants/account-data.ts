import type { User } from "@/types/user";
import type { Address } from "@/types/address";
import type { Order } from "@/types/order";

export const DEMO_USER: User = {
  id: "user-1",
  name: "Priya Mehta",
  email: "priya.mehta@email.com",
  phone: "+91 98765 43210",
  role: "CUSTOMER",
  createdAt: "2024-06-15",
};

export const DEMO_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    userId: "user-1",
    label: "home",
    name: "Priya Mehta",
    line1: "42, Green Park Colony",
    line2: "Near City Mall",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500032",
    phone: "+91 98765 43210",
    isDefault: true,
  },
  {
    id: "addr-2",
    userId: "user-1",
    label: "work",
    name: "Priya Mehta",
    line1: "Tech Park, Block B, Floor 4",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
    phone: "+91 98765 43210",
    isDefault: false,
  },
];

export const DEMO_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "VALA-10248",
    userId: "user-1",
    customerName: "Priya Mehta",
    customerEmail: "priya.mehta@email.com",
    customerPhone: "+91 98765 43210",
    items: [
      { productId: "p-1", productSlug: "classic-white-cotton-shirt", name: "Classic White Cotton Shirt", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b68?w=800&q=80", schoolName: "Oakridge International School", size: "32", quantity: 2, price: 699 },
      { productId: "p-2", productSlug: "navy-blue-formal-trouser", name: "Navy Blue Formal Trouser", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80", schoolName: "Oakridge International School", size: "32", quantity: 1, price: 899 },
    ],
    status: "shipped",
    paymentMethod: "cod",
    paymentStatus: "pending",
    deliveryMethod: "standard",
    subtotal: 2297,
    discount: 0,
    shipping: 0,
    tax: 115,
    total: 2412,
    address: { name: "Priya Mehta", line1: "42, Green Park Colony", city: "Hyderabad", state: "Telangana", pincode: "500032", phone: "+91 98765 43210" },
    createdAt: "2025-08-18",
    estimatedDelivery: "22–24 August",
  },
  {
    id: "ord-2",
    orderNumber: "VALA-10192",
    userId: "user-1",
    customerName: "Priya Mehta",
    customerEmail: "priya.mehta@email.com",
    customerPhone: "+91 98765 43210",
    items: [
      { productId: "p-6", productSlug: "black-formal-school-shoes", name: "Black Formal School Shoes", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80", schoolName: "Oakridge International School", size: "30", quantity: 1, price: 1299 },
    ],
    status: "delivered",
    paymentMethod: "mock_online",
    paymentStatus: "paid",
    deliveryMethod: "express",
    subtotal: 1299,
    discount: 100,
    shipping: 149,
    tax: 65,
    total: 1413,
    address: { name: "Priya Mehta", line1: "42, Green Park Colony", city: "Hyderabad", state: "Telangana", pincode: "500032", phone: "+91 98765 43210" },
    createdAt: "2025-07-05",
    estimatedDelivery: "Delivered",
  },
];

export function getDemoOrder(id: string) {
  return DEMO_ORDERS.find((o) => o.id === id);
}

export function getDemoOrderByNumber(num: string) {
  return DEMO_ORDERS.find((o) => o.orderNumber.toLowerCase() === num.toLowerCase());
}
