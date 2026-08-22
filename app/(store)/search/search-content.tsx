"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Clock, TrendingUp, X } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/common/Input";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useSearchStore } from "@/store/search-store";
import { useProducts } from "@/hooks/use-api";
import { POPULAR_SEARCHES } from "@/lib/products";

export function SearchContent({ initialQuery = "" }: { initialQuery?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get("q") ?? initialQuery;
  const [query, setQuery] = useState(urlQuery);
  const [focused, setFocused] = useState(false);
  const { recentSearches, addSearch, clearSearches } = useSearchStore();

  const { data: suggestionData } = useProducts(
    { q: query.trim(), limit: 5 },
    query.trim().length >= 2
  );

  const suggestions = useMemo(() => {
    if (query.trim().length < 2) return [];
    const items = suggestionData?.items ?? [];
    const names = new Set<string>();
    for (const product of items) {
      names.add(product.name);
      if (product.schoolName) names.add(product.schoolName);
    }
    return Array.from(names).slice(0, 5);
  }, [query, suggestionData]);

  const { data: productData, isLoading, isError } = useProducts(
    { q: urlQuery.trim(), limit: 24 },
    !!urlQuery.trim()
  );

  const products = urlQuery.trim() ? (productData?.items ?? []) : [];
  const total = urlQuery.trim() ? (productData?.total ?? 0) : 0;

  const handleSearch = (term: string) => {
    const q = term.trim();
    if (!q) return;
    addSearch(q);
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setFocused(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const showSuggestions = focused && query.trim().length >= 2 && suggestions.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <PageHeader title="Search" description="Find uniforms, schools, and accessories." />

      <form onSubmit={handleSubmit} className="relative mb-8">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search products, schools, categories..."
          icon={<Search className="h-4 w-4" />}
          aria-label="Search"
        />
        {showSuggestions && (
          <div className="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-xl border border-border bg-surface shadow-elevated">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={() => handleSearch(s)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-primary/5"
              >
                <Search className="h-4 w-4 shrink-0 text-muted" />
                {s}
              </button>
            ))}
          </div>
        )}
      </form>

      {!urlQuery.trim() && (
        <div className="grid gap-10 md:grid-cols-2">
          {recentSearches.length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-medium text-primary">
                  <Clock className="h-4 w-4" />
                  Recent Searches
                </h2>
                <button
                  type="button"
                  onClick={clearSearches}
                  className="text-xs text-muted hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSearch(term)}
                    className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-primary/30"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-medium text-primary">
              <TrendingUp className="h-4 w-4" />
              Popular Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSearch(term)}
                  className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-accent/50 hover:bg-accent/5"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {urlQuery.trim() && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted">
              {total} result{total !== 1 ? "s" : ""} for &ldquo;{urlQuery}&rdquo;
            </p>
            <Link
              href="/search"
              className="flex items-center gap-1 text-xs text-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Link>
          </div>

          {isLoading ? (
            <ProductGridSkeleton />
          ) : isError ? (
            <EmptyState
              title="Search failed"
              description="Please try again in a moment."
              actionLabel="Shop All"
              actionHref="/shop"
            />
          ) : products.length === 0 ? (
            <EmptyState
              title="No results found"
              description="Try different keywords or browse our popular searches."
              actionLabel="Shop All"
              actionHref="/shop"
            />
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
