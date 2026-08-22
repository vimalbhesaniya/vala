"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatPrice } from "@/lib/utils/format";
import type { CartItem } from "@/types/cart";

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();
  const { add: addWishlist } = useWishlistStore();

  return (
    <div className="flex gap-4 border-b border-border py-5 last:border-0">
      <Link href={`/products/${item.productSlug}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#f0efec]">
        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] text-muted uppercase">{item.schoolName}</p>
        <Link href={`/products/${item.productSlug}`}>
          <h3 className="mt-0.5 text-sm font-medium text-foreground hover:text-accent">{item.name}</h3>
        </Link>
        <p className="mt-1 text-xs text-muted">Size {item.size} · {item.color}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-border">
            <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center hover:bg-primary/5" aria-label="Decrease">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center hover:bg-primary/5" aria-label="Increase">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
        </div>
        <div className="mt-2 flex gap-3">
          <button type="button" onClick={() => { addWishlist(item.productSlug); removeItem(item.id); }} className="flex items-center gap-1 text-xs text-muted hover:text-primary">
            <Heart className="h-3.5 w-3.5" /> Wishlist
          </button>
          <button type="button" onClick={() => removeItem(item.id)} className="flex items-center gap-1 text-xs text-muted hover:text-error">
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}
