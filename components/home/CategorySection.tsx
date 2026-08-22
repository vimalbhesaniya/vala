"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { useCategories } from "@/hooks/use-api";

export function CategorySection() {
  const { data: categories = [], isLoading, isError } = useCategories();

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-medium tracking-tight text-primary sm:text-[40px]">
              Shop by Category
            </h2>
            <p className="mt-2 text-sm text-muted sm:text-base">
              Everything your student needs, organized beautifully.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent sm:flex"
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10">
            <ProductGridSkeleton count={6} />
          </div>
        ) : isError ? (
          <p className="mt-10 text-sm text-muted">Unable to load categories.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[3/4]"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <h3 className="text-base font-medium text-white sm:text-lg">
                        {category.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-white/70">
                        {category.productCount} products
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-white/80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
