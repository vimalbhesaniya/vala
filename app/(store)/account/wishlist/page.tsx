"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/common/Button";
import { useWishlistStore } from "@/store/wishlist-store";
import { catalogApi } from "@/lib/api/services";
import type { Product } from "@/types/product";

export default function WishlistPage() {
  const { productSlugs } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      if (productSlugs.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);
      try {
        const res = await catalogApi.getProducts({
          slugs: productSlugs.join(","),
          limit: productSlugs.length,
        });
        setProducts(res.data.items);
      } catch {
        setError(true);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [productSlugs]);

  return (
    <div>
      <PageHeader
        title="Wishlist"
        description={`${productSlugs.length} saved item${productSlugs.length !== 1 ? "s" : ""}`}
      />

      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : error ? (
        <EmptyState
          title="Unable to load wishlist"
          description="Please try again in a moment."
          actionLabel="Browse Shop"
          actionHref="/shop"
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Save items you love by tapping the heart icon."
          actionLabel="Browse Shop"
          actionHref="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {products.length > 0 && (
        <div className="mt-10">
          <Link href="/shop">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
