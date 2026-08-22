"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Star,
  Minus,
  Plus,
  Truck,
  RefreshCw,
  Shield,
  Ruler,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { Modal } from "@/components/common/Modal";
import { SizeGuideContent } from "@/components/product/SizeGuideContent";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";
import { useToast } from "@/components/providers/toast-provider";
import { useReviews, useProducts } from "@/hooks/use-api";
import { useSiteSettings } from "@/hooks/use-site-config";
import { formatPrice, calculateDiscount } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types/product";

const TABS = [
  { id: "details", label: "Details" },
  { id: "material", label: "Material" },
  { id: "fit", label: "Fit & Size" },
  { id: "care", label: "Care" },
  { id: "delivery", label: "Delivery" },
  { id: "returns", label: "Returns" },
  { id: "reviews", label: "Reviews" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { toggle, has } = useWishlistStore();
  const { add: addRecentlyViewed, productSlugs } = useRecentlyViewedStore();
  const { toast } = useToast();

  const sizes = useMemo(
    () => [...new Set(product.variants.map((v) => v.size))],
    [product.variants]
  );
  const colors = useMemo(
    () => [...new Set(product.variants.map((v) => v.color))],
    [product.variants]
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  ) ?? product.variants.find((v) => v.size === selectedSize) ?? product.variants[0];

  const price = selectedVariant?.price ?? 0;
  const comparePrice = selectedVariant?.comparePrice ?? 0;
  const discount = calculateDiscount(price, comparePrice);
  const inStock = (selectedVariant?.stock ?? 0) > 0;
  const isWishlisted = has(product.slug);

  useEffect(() => {
    addRecentlyViewed(product.slug);
  }, [product.slug, addRecentlyViewed]);

  const { data: relatedData } = useProducts(
    { school: product.schoolSlug, limit: 5 },
    !!product.schoolSlug
  );

  const relatedProducts = useMemo(
    () =>
      (relatedData?.items ?? [])
        .filter((p) => p.id !== product.id)
        .slice(0, 4),
    [relatedData, product.id]
  );

  const recentSlugs = productSlugs.filter((slug) => slug !== product.slug).slice(0, 4);
  const { data: recentData } = useProducts(
    { slugs: recentSlugs.join(","), limit: 4 },
    recentSlugs.length > 0
  );

  const recentlyViewedProducts = useMemo(
    () => recentData?.items ?? [],
    [recentData]
  );

  const { data: productReviews = [], isLoading: reviewsLoading } = useReviews(product.slug);
  const { data: siteSettings } = useSiteSettings();
  const freeDeliveryThreshold = siteSettings?.shipping.freeThreshold ?? 999;

  const addToCart = () => {
    if (!selectedVariant) return;
    addItem({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      image: product.images[0],
      schoolName: product.schoolName,
      size: selectedVariant.size,
      color: selectedVariant.color,
      sku: selectedVariant.sku,
      price: selectedVariant.price,
      comparePrice: selectedVariant.comparePrice,
      quantity,
    });
    toast("Added to cart");
  };

  const buyNow = () => {
    addToCart();
    router.push("/checkout");
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
    <>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#f0efec]">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.badge && (
              <div className="absolute left-4 top-4">
                <Badge variant={badgeVariant}>
                  {product.badge === "bestseller" ? "Bestseller" : product.badge}
                </Badge>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "relative h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                    selectedImage === i ? "border-primary" : "border-transparent"
                  )}
                >
                  <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:pt-4">
          <p className="text-xs tracking-wide text-muted uppercase">
            {product.schoolName}
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-primary sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(product.rating)
                      ? "fill-accent text-accent"
                      : "text-border"
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-muted">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-primary">
              {formatPrice(price)}
            </span>
            {comparePrice > price && (
              <>
                <span className="text-base text-muted line-through">
                  {formatPrice(comparePrice)}
                </span>
                <span className="text-sm font-medium text-error">-{discount}%</span>
              </>
            )}
          </div>

          <p className="mt-2 text-xs text-muted">
            {price >= freeDeliveryThreshold
              ? "Free delivery on this item"
              : `Add ${formatPrice(freeDeliveryThreshold - price)} more for free delivery`}
          </p>

          {/* Size */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                Size
              </p>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="flex items-center gap-1 text-xs text-accent hover:underline"
              >
                <Ruler className="h-3.5 w-3.5" />
                Size Guide
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {sizes.map((size) => {
                const variant = product.variants.find((v) => v.size === size);
                const available = (variant?.stock ?? 0) > 0;
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!available}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "flex h-11 min-w-[44px] items-center justify-center rounded-xl border px-3 text-sm transition-colors",
                      selectedSize === size
                        ? "border-primary bg-primary text-white"
                        : available
                          ? "border-border hover:border-primary/30"
                          : "cursor-not-allowed border-border text-muted line-through opacity-50"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color */}
          {colors.length > 1 && (
            <div className="mt-6">
              <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                Color — {selectedColor}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-xs transition-colors",
                      selectedColor === color
                        ? "border-primary bg-primary text-white"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6">
            <p className="text-xs font-semibold tracking-wider text-primary uppercase">
              Quantity
            </p>
            <div className="mt-3 flex items-center rounded-xl border border-border w-fit">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center hover:bg-primary/5"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-sm font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center hover:bg-primary/5"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions - desktop */}
          <div className="mt-8 hidden gap-3 sm:flex">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={!inStock}
              onClick={addToCart}
            >
              {inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              disabled={!inStock}
              onClick={buyNow}
            >
              Buy Now
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                toggle(product.slug);
                toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-5 w-5", isWishlisted && "fill-error text-error")} />
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-4 rounded-2xl border border-border bg-background p-4">
            <div className="text-center">
              <Truck className="mx-auto h-5 w-5 text-accent" />
              <p className="mt-2 text-[11px] text-muted">Fast Delivery</p>
            </div>
            <div className="text-center">
              <RefreshCw className="mx-auto h-5 w-5 text-accent" />
              <p className="mt-2 text-[11px] text-muted">Easy Exchange</p>
            </div>
            <div className="text-center">
              <Shield className="mx-auto h-5 w-5 text-accent" />
              <p className="mt-2 text-[11px] text-muted">Quality Assured</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16 border-t border-border pt-10">
        <div className="flex gap-1 overflow-x-auto border-b border-border pb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8 text-sm leading-relaxed text-muted">
          {activeTab === "details" && (
            <div className="max-w-2xl space-y-4">
              <p>{product.description}</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Category: {product.categoryName}</li>
                <li>Gender: {product.gender}</li>
                {product.grade && <li>Grade: {product.grade}</li>}
                <li>SKU: {selectedVariant?.sku}</li>
              </ul>
            </div>
          )}
          {activeTab === "material" && (
            <p>
              {product.material ??
                "Premium cotton blend with reinforced stitching. Breathable fabric designed for all-day comfort in Indian school climates."}
            </p>
          )}
          {activeTab === "fit" && (
            <div className="space-y-4">
              <p>
                Our uniforms are designed for a comfortable regular fit. Refer to the size guide
                for precise measurements. When in doubt, size up for growing children.
              </p>
              <Button variant="outline" size="sm" onClick={() => setSizeGuideOpen(true)}>
                View Size Guide
              </Button>
            </div>
          )}
          {activeTab === "care" && (
            <ul className="list-disc space-y-2 pl-5">
              <li>Machine wash cold with similar colours</li>
              <li>Do not bleach</li>
              <li>Tumble dry low or line dry</li>
              <li>Iron on medium heat if needed</li>
              <li>Do not dry clean unless specified</li>
            </ul>
          )}
          {activeTab === "delivery" && (
            <ul className="list-disc space-y-2 pl-5">
              <li>Standard delivery: 3–5 business days</li>
              <li>Express delivery: 1–2 business days (₹149)</li>
              <li>Free delivery on orders above ₹{freeDeliveryThreshold}</li>
              <li>Track your order from your account or the track order page</li>
            </ul>
          )}
          {activeTab === "returns" && (
            <ul className="list-disc space-y-2 pl-5">
              <li>7-day easy exchange on unused items with tags</li>
              <li>Size exchanges are free for first exchange</li>
              <li>Refunds processed within 5–7 business days</li>
              <li>
                See our{" "}
                <Link href="/returns" className="text-accent hover:underline">
                  returns policy
                </Link>{" "}
                for full details
              </li>
            </ul>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {reviewsLoading ? (
                <p>Loading reviews...</p>
              ) : productReviews.length === 0 ? (
                <p>No reviews yet. Be the first to review this product.</p>
              ) : (
                productReviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3.5 w-3.5",
                              i < review.rating
                                ? "fill-accent text-accent"
                                : "text-border"
                            )}
                          />
                        ))}
                      </div>
                      {review.verified && (
                        <span className="text-xs text-success">Verified Purchase</span>
                      )}
                    </div>
                    <p className="mt-2 text-foreground">{review.comment}</p>
                    <p className="mt-2 text-xs text-muted">
                      {review.customerName} · {review.createdAt}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="text-xl font-medium text-primary">You May Also Like</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently viewed */}
      {recentlyViewedProducts.length > 0 && (
        <section className="mt-16 border-t border-border pt-10">
          <h2 className="text-xl font-medium text-primary">Recently Viewed</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {recentlyViewedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface p-4 shadow-elevated sm:hidden">
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-primary">
              {formatPrice(price)}
            </p>
            <p className="text-xs text-muted">
              {inStock ? `Size ${selectedSize}` : "Out of stock"}
            </p>
          </div>
          <Button
            variant="primary"
            className="shrink-0"
            disabled={!inStock}
            onClick={addToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="h-20 sm:hidden" aria-hidden />

      <Modal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        title="Size Guide"
        className="max-w-2xl"
      >
        <div className="p-6">
          <SizeGuideContent />
        </div>
      </Modal>
    </>
  );
}
