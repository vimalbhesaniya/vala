"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatPrice, calculateDiscount } from "@/lib/utils/format";
import { Badge } from "@/components/common/Badge";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useToast } from "@/components/providers/toast-provider";
import type { Product } from "@/types/product";
import { getProductPrice } from "@/types/product";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const { toast } = useToast();
  const { price, comparePrice } = getProductPrice(product);
  const discount = calculateDiscount(price, comparePrice);
  const secondaryImage = product.images[1];
  const isWishlisted = has(product.slug);
  const firstVariant = product.variants[0];

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product.slug);
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!firstVariant) return;
    addItem({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      image: product.images[0],
      schoolName: product.schoolName,
      size: firstVariant.size,
      color: firstVariant.color,
      sku: firstVariant.sku,
      price: firstVariant.price,
      comparePrice: firstVariant.comparePrice,
      quantity: 1,
    });
    toast("Added to cart");
  };

  const badgeVariant =
    product.badge === "sale"
      ? "sale"
      : product.badge === "new"
        ? "new"
        : product.badge === "bestseller"
          ? "accent"
          : "default";

  return (
    <article
      className={cn("group relative flex flex-col", className)}
    >
      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#f0efec]"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          />
        )}

        {/* Badge */}
        {product.badge && (
          <div className="absolute left-3 top-3">
            <Badge variant={badgeVariant}>
              {product.badge === "bestseller" ? "Bestseller" : product.badge}
            </Badge>
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white sm:opacity-0 sm:group-hover:opacity-100",
            isWishlisted ? "text-error opacity-100" : "text-primary opacity-100"
          )}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
        </button>

        {/* Quick add - desktop hover */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute inset-x-3 bottom-3 hidden h-11 items-center justify-center gap-2 rounded-full bg-primary text-xs font-medium tracking-wider text-white uppercase opacity-0 transition-all duration-200 group-hover:opacity-100 sm:flex"
        >
          <Plus className="h-4 w-4" />
          Quick Add
        </button>
      </Link>

      {/* Info */}
      <div className="mt-3 flex flex-1 flex-col px-0.5">
        <p className="truncate text-[11px] tracking-wide text-muted uppercase">
          {product.schoolName}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 line-clamp-2 text-sm leading-snug text-foreground transition-colors hover:text-accent sm:text-base">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-1.5 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-xs font-medium text-foreground">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-muted">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-foreground sm:text-base">
            {formatPrice(price)}
          </span>
          {comparePrice > price && (
            <>
              <span className="text-xs text-muted line-through">
                {formatPrice(comparePrice)}
              </span>
              <span className="text-xs font-medium text-error">
                -{discount}%
              </span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
