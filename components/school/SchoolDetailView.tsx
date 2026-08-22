"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Package } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { useProducts, useUniformSets } from "@/hooks/use-api";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { School } from "@/types/school";

type TabKey = "boys" | "girls" | "sports" | "accessories";

const TABS: { key: TabKey; label: string }[] = [
  { key: "boys", label: "Boys" },
  { key: "girls", label: "Girls" },
  { key: "sports", label: "Sports" },
  { key: "accessories", label: "Accessories" },
];

interface UniformSetItem {
  productId: string;
  name: string;
  price: number;
}

interface UniformSet {
  id: string;
  name: string;
  grade?: string;
  gender?: string;
  items: UniformSetItem[];
  individualTotal: number;
  setPrice: number;
  savings: number;
}

export function SchoolDetailView({ school }: { school: School }) {
  const [activeTab, setActiveTab] = useState<TabKey>("boys");

  const productParams = useMemo(() => {
    const base = { school: school.slug, limit: 50 };
    if (activeTab === "boys") return { ...base, gender: "boys" };
    if (activeTab === "girls") return { ...base, gender: "girls" };
    if (activeTab === "sports") return { ...base, category: "sports" };
    return { ...base, category: "accessories" };
  }, [school.slug, activeTab]);

  const { data: productData, isLoading, isError } = useProducts(productParams);
  const products = productData?.items ?? [];

  const { data: uniformSets = [] } = useUniformSets(school.slug);
  const uniformSet = (uniformSets[0] as UniformSet | undefined) ?? null;

  const { data: schoolProductsData } = useProducts({ school: school.slug, limit: 50 });
  const productSlugById = useMemo(() => {
    const map = new Map<string, string>();
    schoolProductsData?.items.forEach((p) => map.set(p.id, p.slug));
    return map;
  }, [schoolProductsData]);

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-[#f5f4f1]">
          <Image
            src={school.logo}
            alt={`${school.name} logo`}
            width={96}
            height={96}
            className="h-full w-full object-contain p-3"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] font-medium tracking-tight text-primary sm:text-[36px]">
            {school.name}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-4 w-4" />
            {school.city}, {school.state}
          </p>
          {school.description && (
            <p className="mt-3 max-w-2xl text-sm text-muted">{school.description}</p>
          )}
          {school.productCount && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
              <Package className="h-3.5 w-3.5" />
              {school.productCount} products available
            </p>
          )}
        </div>
      </div>

      {uniformSet && (
        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="border-b border-border px-6 py-4">
            <Badge variant="accent">Uniform Set</Badge>
            <h2 className="mt-2 text-lg font-medium text-primary">
              {uniformSet.grade && uniformSet.gender
                ? `Complete ${uniformSet.grade} Set — ${uniformSet.gender}`
                : uniformSet.name}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Save {formatPrice(uniformSet.savings)} when you buy the full set
            </p>
          </div>
          <ul className="divide-y divide-border px-6">
            {uniformSet.items.map((item) => {
              const slug = productSlugById.get(item.productId);
              return (
                <li key={item.name} className="flex items-center justify-between py-3 text-sm">
                  {slug ? (
                    <Link
                      href={`/products/${slug}`}
                      className="text-foreground hover:text-accent"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="text-foreground">{item.name}</span>
                  )}
                  <span className="text-muted">{formatPrice(item.price)}</span>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center justify-between border-t border-border bg-background px-6 py-4">
            <div>
              <p className="text-xs text-muted line-through">
                {formatPrice(uniformSet.individualTotal)}
              </p>
              <p className="text-xl font-semibold text-primary">
                {formatPrice(uniformSet.setPrice)}
              </p>
            </div>
            {uniformSet.items[0] && productSlugById.get(uniformSet.items[0].productId) ? (
              <Link href={`/products/${productSlugById.get(uniformSet.items[0].productId)}`}>
                <Button variant="primary" size="sm">
                  Shop Set
                </Button>
              </Link>
            ) : (
              <Link href={`/shop?school=${school.slug}`}>
                <Button variant="primary" size="sm">
                  Shop Set
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="mt-10 border-b border-border">
        <div className="flex gap-1 overflow-x-auto pb-px">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        {products.length} product{products.length !== 1 ? "s" : ""}
      </p>

      {isLoading ? (
        <div className="mt-6">
          <ProductGridSkeleton count={4} />
        </div>
      ) : isError ? (
        <EmptyState
          title="Unable to load products"
          description="Please try again in a moment."
          actionLabel="Shop All"
          actionHref="/shop"
        />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products in this category"
          description="Try another tab or browse all uniforms."
          actionLabel="Shop All"
          actionHref="/shop"
        />
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
