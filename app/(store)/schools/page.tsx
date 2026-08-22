"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PageHeader } from "@/components/common/PageHeader";
import { Input } from "@/components/common/Input";
import { SchoolCard } from "@/components/school/SchoolCard";
import { EmptyState } from "@/components/common/EmptyState";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { useSchools } from "@/hooks/use-api";

export default function SchoolsPage() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const { data: schools = [], isLoading, isError } = useSchools();

  const cities = useMemo(
    () => [...new Set(schools.map((s) => s.city))].sort(),
    [schools]
  );
  const states = useMemo(
    () => [...new Set(schools.map((s) => s.state))].sort(),
    [schools]
  );

  const filteredSchools = useMemo(() => {
    const q = search.toLowerCase().trim();
    return schools.filter((school) => {
      if (city && school.city !== city) return false;
      if (state && school.state !== state) return false;
      if (!q) return true;
      return (
        school.name.toLowerCase().includes(q) ||
        school.city.toLowerCase().includes(q) ||
        school.state.toLowerCase().includes(q)
      );
    });
  }, [schools, search, city, state]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Schools" }]} />
      <PageHeader
        title="School Directory"
        description="Find your school and shop approved uniforms in one place."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search schools..."
          icon={<Search className="h-4 w-4" />}
          aria-label="Search schools"
        />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="h-12 rounded-xl border border-border bg-surface px-4 text-sm"
          aria-label="Filter by city"
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="h-12 rounded-xl border border-border bg-surface px-4 text-sm"
          aria-label="Filter by state"
        >
          <option value="">All states</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {(city || state || search) && (
        <button
          type="button"
          onClick={() => { setSearch(""); setCity(""); setState(""); }}
          className="mb-6 text-xs text-muted hover:text-foreground"
        >
          Clear filters
        </button>
      )}

      <p className="mb-6 text-sm text-muted">
        {filteredSchools.length} school{filteredSchools.length !== 1 ? "s" : ""} found
      </p>

      {isLoading ? (
        <ProductGridSkeleton count={6} />
      ) : isError ? (
        <EmptyState
          title="Unable to load schools"
          description="Please try again in a moment."
          actionLabel="Retry"
          actionHref="/schools"
        />
      ) : filteredSchools.length === 0 ? (
        <EmptyState
          title="No schools found"
          description="Try adjusting your search or filters."
          actionLabel="View All Schools"
          actionHref="/schools"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSchools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      )}
    </div>
  );
}
