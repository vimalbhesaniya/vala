"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Badge } from "@/components/common/Badge";
import { useUniformSets, useSchools } from "@/hooks/use-api";
import { formatPrice } from "@/lib/utils/format";

export function UniformSetSection() {
  const { data: sets = [], isLoading } = useUniformSets();
  const { data: schools = [] } = useSchools();

  if (isLoading) {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-[480px] animate-pulse rounded-3xl bg-border/40" />
        </div>
      </section>
    );
  }

  const set = sets[0];
  if (!set) return null;

  const school = schools.find((s) => s.id === set.schoolId);
  const schoolSlug = school?.slug ?? "";

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-border bg-surface">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-square bg-[#f5f4f1] lg:aspect-auto lg:min-h-[480px]">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {set.items.slice(0, 4).map((item, i) => (
                    <div
                      key={item.name}
                      className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-soft"
                      style={{ transform: `rotate(${(i - 1.5) * 3}deg)` }}
                    >
                      <span className="text-center text-sm font-medium text-primary">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
              <Badge variant="accent" className="w-fit">
                Complete the look
              </Badge>
              <h2 className="mt-4 text-[28px] font-medium tracking-tight text-primary sm:text-[36px]">
                {set.schoolName ?? school?.name ?? set.name}
              </h2>
              <p className="mt-2 text-sm text-muted">
                {set.grade} · {set.gender}
              </p>

              <ul className="mt-8 space-y-3">
                {set.items.map((item, i) => (
                  <li key={item.name} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 text-xs font-medium text-primary">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-foreground">{item.name}</span>
                    <span className="text-sm text-muted">{formatPrice(item.price)}</span>
                    {i < set.items.length - 1 && (
                      <Plus className="hidden h-3 w-3 text-muted sm:block" aria-hidden />
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl bg-background p-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted">Individual total</span>
                  <span className="text-sm text-muted line-through">
                    {formatPrice(set.individualTotal)}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-base font-medium text-foreground">Set price</span>
                  <span className="text-2xl font-semibold text-primary">
                    {formatPrice(set.setPrice)}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-success">
                  Save {formatPrice(set.savings)}
                </p>
              </div>

              {schoolSlug && (
                <Link href={`/schools/${schoolSlug}`} className="mt-8">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Shop Complete Set
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
