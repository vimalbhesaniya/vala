"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/common/Input";
import { SchoolCard } from "@/components/school/SchoolCard";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { useSchoolStore } from "@/store/school-store";
import { useSchools } from "@/hooks/use-api";
import type { School } from "@/types/school";

export function SchoolSelector() {
  const [query, setQuery] = useState("");
  const { selectedSchool, setSelectedSchool, clearSelectedSchool } =
    useSchoolStore();

  const { data: schools = [], isLoading, isError } = useSchools();

  const filteredSchools = useMemo(() => {
    if (!query.trim()) return schools;
    const q = query.toLowerCase();
    return schools.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q)
    );
  }, [query, schools]);

  const handleSelect = (school: School) => {
    setSelectedSchool(school);
    setQuery("");
  };

  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[28px] font-medium tracking-tight text-primary sm:text-[40px]">
            Shop Your School
          </h2>
          <p className="mt-3 text-sm text-muted sm:text-base">
            Find everything your student needs in seconds.
          </p>
        </div>

        {selectedSchool && (
          <div className="mx-auto mt-8 flex max-w-2xl items-center justify-between gap-4 rounded-2xl border border-accent/30 bg-accent/5 px-5 py-4">
            <p className="text-sm text-foreground sm:text-base">
              <span className="mr-1.5" aria-hidden>
                🏫
              </span>
              Shopping for{" "}
              <span className="font-medium">{selectedSchool.name}</span>
            </p>
            <button
              type="button"
              onClick={clearSelectedSchool}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-primary/5 hover:text-primary"
              aria-label="Clear school selection"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mx-auto mt-8 max-w-xl">
          <Input
            type="search"
            placeholder="Search your school..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            aria-label="Search schools"
          />
        </div>

        {isLoading ? (
          <div className="mt-8">
            <ProductGridSkeleton count={6} />
          </div>
        ) : isError ? (
          <p className="mt-8 text-center text-sm text-muted">
            Unable to load schools. Please try again later.
          </p>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSchools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && filteredSchools.length === 0 && (
          <p className="mt-8 text-center text-sm text-muted">
            No schools found. Try a different search term.
          </p>
        )}
      </div>
    </section>
  );
}
