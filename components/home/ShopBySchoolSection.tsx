"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SchoolCard } from "@/components/school/SchoolCard";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { useSchools } from "@/hooks/use-api";

export function ShopBySchoolSection() {
  const { data: schools = [], isLoading, isError } = useSchools();

  return (
    <section className="bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-medium tracking-tight text-primary sm:text-[40px]">
              Shop by School
            </h2>
            <p className="mt-2 text-sm text-muted sm:text-base">
              Curated collections for your institution.
            </p>
          </div>
          <Link
            href="/schools"
            className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent sm:flex"
          >
            All schools
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10">
            <ProductGridSkeleton count={4} />
          </div>
        ) : isError ? (
          <p className="mt-10 text-sm text-muted">Unable to load schools.</p>
        ) : (
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {schools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
