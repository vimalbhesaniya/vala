"use client";

import { useMemo, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Drawer } from "@/components/common/Drawer";
import { Button } from "@/components/common/Button";
import { useSchoolStore } from "@/store/school-store";
import { useProducts, useSchools, useCategories } from "@/hooks/use-api";
import {
  type ProductFilters,
  type SortOption,
  ALL_SIZES,
  PRICE_RANGES,
  PRODUCT_FILTER_PARAMS,
  ALL_SCHOOLS_FILTER,
  ALL_CATEGORIES_FILTER,
  parseProductFiltersFromSearchParams,
  productFiltersToApiParams,
} from "@/lib/products";
import type { School } from "@/types/school";
import type { Category } from "@/types/category";
import { cn } from "@/lib/utils/cn";

interface ProductListingProps {
  title?: string;
  defaultFilters?: Partial<ProductFilters>;
  showSchoolBanner?: boolean;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "bestsellers", label: "Best Sellers" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function FilterPanel({
  filters,
  schools,
  categories,
  onChange,
}: {
  filters: ProductFilters;
  schools: School[];
  categories: Category[];
  onChange: (f: Partial<ProductFilters>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold tracking-wider text-primary uppercase">School</h3>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="school" checked={!filters.schoolSlug} onChange={() => onChange({ schoolSlug: ALL_SCHOOLS_FILTER })} className="accent-primary" />
            All schools
          </label>
          {schools.map((s) => (
            <label key={s.id} className="flex items-center gap-2 text-sm">
              <input type="radio" name="school" checked={filters.schoolSlug === s.slug} onChange={() => onChange({ schoolSlug: s.slug })} className="accent-primary" />
              {s.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold tracking-wider text-primary uppercase">Category</h3>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="category" checked={!filters.categorySlug} onChange={() => onChange({ categorySlug: ALL_CATEGORIES_FILTER })} className="accent-primary" />
            All categories
          </label>
          {categories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm">
              <input type="radio" name="category" checked={filters.categorySlug === c.slug} onChange={() => onChange({ categorySlug: c.slug })} className="accent-primary" />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold tracking-wider text-primary uppercase">Gender</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {["boys", "girls", "unisex"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onChange({ gender: filters.gender === g ? undefined : g })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs capitalize transition-colors",
                filters.gender === g ? "border-primary bg-primary text-white" : "border-border hover:border-primary/30"
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold tracking-wider text-primary uppercase">Size</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange({ size: filters.size === s ? undefined : s })}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border text-xs transition-colors",
                filters.size === s ? "border-primary bg-primary text-white" : "border-border hover:border-primary/30"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold tracking-wider text-primary uppercase">Price</h3>
        <div className="mt-3 space-y-2">
          {PRICE_RANGES.map((r) => (
            <label key={r.label} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="price"
                checked={filters.minPrice === r.min && filters.maxPrice === r.max}
                onChange={() => onChange({ minPrice: r.min, maxPrice: r.max })}
                className="accent-primary"
              />
              {r.label}
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="price" checked={!filters.minPrice && !filters.maxPrice} onChange={() => onChange({ minPrice: undefined, maxPrice: undefined })} className="accent-primary" />
            Any price
          </label>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={!!filters.inStock} onChange={(e) => onChange({ inStock: e.target.checked || undefined })} className="accent-primary" />
        In stock only
      </label>
    </div>
  );
}

export function ProductListing({ defaultFilters = {}, showSchoolBanner = true }: ProductListingProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { selectedSchool } = useSchoolStore();
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: schools = [], isLoading: schoolsLoading } = useSchools();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const filters: ProductFilters = useMemo(
    () =>
      parseProductFiltersFromSearchParams(
        searchParams,
        defaultFilters,
        showSchoolBanner ? selectedSchool?.slug : undefined
      ),
    [searchParams, defaultFilters, selectedSchool?.slug, showSchoolBanner]
  );

  const productParams = useMemo(() => productFiltersToApiParams(filters), [filters]);

  const { data: productData, isLoading, isError } = useProducts(productParams);
  const products = productData?.items ?? [];
  const total = productData?.total ?? 0;
  const totalPages = productData?.totalPages ?? Math.ceil(total / (filters.limit || 12));
  const filtersLoading = schoolsLoading || categoriesLoading;

  const updateFilters = useCallback(
    (partial: Partial<ProductFilters> & { schoolSlug?: string; categorySlug?: string }) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(partial).forEach(([key, value]) => {
        const paramKey =
          PRODUCT_FILTER_PARAMS[key as keyof typeof PRODUCT_FILTER_PARAMS];
        if (!paramKey) return;

        if (key === "schoolSlug" && value === ALL_SCHOOLS_FILTER) {
          params.set(paramKey, ALL_SCHOOLS_FILTER);
          return;
        }
        if (key === "categorySlug" && value === ALL_CATEGORIES_FILTER) {
          params.set(paramKey, ALL_CATEGORIES_FILTER);
          return;
        }

        if (value === undefined || value === "" || value === false) {
          params.delete(paramKey);
        } else {
          params.set(paramKey, String(value));
        }
      });

      // Reset to page 1 when changing filters (except explicit page changes)
      if (!("page" in partial)) {
        params.delete(PRODUCT_FILTER_PARAMS.page);
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const goToPage = useCallback(
    (nextPage: number) => {
      updateFilters({ page: nextPage });
    },
    [updateFilters]
  );

  return (
    <div>
      {showSchoolBanner && selectedSchool && (
        <div className="mb-6 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
          Shopping for <span className="font-medium">{selectedSchool.name}</span>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
        <Button variant="outline" size="sm" onClick={() => setFilterOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </Button>
        <select
          value={filters.sort}
          onChange={(e) => updateFilters({ sort: e.target.value as SortOption })}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-xs"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <p className="mb-6 text-sm text-muted">{total} product{total !== 1 ? "s" : ""} found</p>

      <div className="flex gap-10">
        <aside className="hidden w-56 shrink-0 lg:block">
          {filtersLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-border/40" />
              ))}
            </div>
          ) : (
            <FilterPanel
              filters={filters}
              schools={schools}
              categories={categories}
              onChange={updateFilters}
            />
          )}
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 hidden items-center justify-end gap-3 lg:flex">
            <ArrowUpDown className="h-4 w-4 text-muted" />
            <select
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value as SortOption })}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <ProductGridSkeleton />
          ) : isError ? (
            <EmptyState
              title="Unable to load products"
              description="Please try again in a moment."
              actionLabel="Refresh"
              actionHref={pathname}
            />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search terms."
              actionLabel="View All Products"
              actionHref="/shop"
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goToPage(i + 1)}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg border text-sm transition-colors",
                        filters.page === i + 1 ? "border-primary bg-primary text-white" : "border-border hover:border-primary/30"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Drawer open={filterOpen} onClose={() => setFilterOpen(false)} title="Filters" side="bottom" className="rounded-t-3xl">
        <div className="p-5 pb-8">
          <FilterPanel
            filters={filters}
            schools={schools}
            categories={categories}
            onChange={(f) => { updateFilters(f); }}
          />
          <Button variant="primary" className="mt-6 w-full" onClick={() => setFilterOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
