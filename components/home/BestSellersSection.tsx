"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { useProducts } from "@/hooks/use-api";

export function BestSellersSection() {
  const { data, isLoading, isError } = useProducts({ sort: "bestsellers", limit: 8 });
  const products = data?.items ?? [];

  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-medium tracking-tight text-primary sm:text-[40px]">
              Best Sellers
            </h2>
            <p className="mt-2 text-sm text-muted sm:text-base">
              Loved by parents and students across India.
            </p>
          </div>
          <Link
            href="/shop?sort=bestsellers"
            className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent sm:flex"
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10">
            <ProductGridSkeleton count={8} />
          </div>
        ) : isError ? (
          <p className="mt-10 text-sm text-muted">Unable to load best sellers.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
