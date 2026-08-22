"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order } from "@/types/order";

interface OrdersStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrder: (id: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) =>
        set((s) => ({ orders: [order, ...s.orders] })),
      getOrder: (id) => get().orders.find((o) => o.id === id),
      getOrderByNumber: (orderNumber) =>
        get().orders.find(
          (o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase()
        ),
    }),
    { name: "vala-orders" }
  )
);
