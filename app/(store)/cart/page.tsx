"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { CartItemRow } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/common/EmptyState";
import { useCartStore } from "@/store/cart-store";
import { useToast } from "@/components/providers/toast-provider";
import { catalogApi } from "@/lib/api/services";

export default function CartPage() {
  const { items, subtotal } = useCartStore();
  const { toast } = useToast();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applying, setApplying] = useState(false);

  const cartSubtotal = subtotal();

  const applyCoupon = async () => {
    const code = coupon.trim();
    if (!code) return;

    setApplying(true);
    try {
      const res = await catalogApi.validateCoupon(code, cartSubtotal);
      setDiscount(res.data.discountAmount);
      toast(`Coupon applied! ₹${res.data.discountAmount} off`);
    } catch (err) {
      setDiscount(0);
      toast(err instanceof Error ? err.message : "Invalid coupon code", "error");
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        <PageHeader title="Your Cart" />
        <EmptyState
          title="Your cart is empty"
          description="Add uniforms to your cart to get started."
          actionLabel="Continue Shopping"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <PageHeader title="Your Cart" description={`${items.length} item${items.length !== 1 ? "s" : ""} in your cart`} />

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}

          <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
            <p className="flex items-center gap-2 text-sm font-medium text-primary">
              <Tag className="h-4 w-4" />
              Coupon Code
            </p>
            <div className="mt-3 flex gap-3">
              <Input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter code (try VALA100)"
                className="flex-1"
              />
              <Button variant="outline" onClick={applyCoupon} disabled={applying}>
                {applying ? "Applying..." : "Apply"}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <CartSummary subtotal={cartSubtotal} discount={discount} />
          <Link href="/checkout" className="block">
            <Button variant="primary" size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>
          <Link href="/shop" className="block">
            <Button variant="outline" size="lg" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
