"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { Drawer } from "@/components/common/Drawer";
import { Button } from "@/components/common/Button";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils/format";

export function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, lastAddedItem, subtotal, itemCount } = useCartStore();
  const total = subtotal();

  return (
    <Drawer open={isDrawerOpen} onClose={closeDrawer} title="Your Bag">
      <div className="flex h-full flex-col">
        {lastAddedItem && (
          <div className="flex items-center gap-2 border-b border-border bg-success/5 px-5 py-3 text-sm text-success">
            <Check className="h-4 w-4" />
            Product added
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">Your bag is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b border-border py-4">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f0efec]">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted">Size {item.size} · Qty {item.quantity}</p>
                  <p className="mt-1 text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-5">
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-muted">Subtotal ({itemCount()} items)</span>
              <span className="font-semibold">{formatPrice(total)}</span>
            </div>
            <CartSummary subtotal={total} showDeliveryProgress className="mb-4 border-0 p-0" />
            <div className="flex flex-col gap-2">
              <Link href="/cart" onClick={closeDrawer}>
                <Button variant="outline" className="w-full">View Cart</Button>
              </Link>
              <Link href="/checkout" onClick={closeDrawer}>
                <Button variant="primary" className="w-full">Checkout</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
