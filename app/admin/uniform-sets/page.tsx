"use client";

import { useUniformSets } from "@/hooks/use-api";
import { AdminScrollPage } from "@/components/admin/AdminGridPage";
import { formatPrice } from "@/lib/utils/format";

export default function AdminUniformSetsPage() {
  const { data: sets = [], isLoading } = useUniformSets();

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-border/40" />;
  }

  if (sets.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted shadow-soft">
        No uniform sets in the database. Run <code className="text-accent">npm run seed</code> to load demo data.
      </p>
    );
  }

  return (
    <AdminScrollPage>
    <div className="grid gap-4 sm:grid-cols-2">
      {sets.map((set) => (
        <div
          key={set.id}
          className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-primary">
                {set.grade} · {set.gender}
              </h3>
              <p className="text-xs text-muted">{set.schoolName ?? set.name}</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {set.items.map((item) => (
              <li key={item.name} className="flex justify-between text-muted">
                <span>{item.name}</span>
                <span>{formatPrice(item.price)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div className="rounded-lg bg-background/50 p-2">
              <dt className="text-[10px] uppercase tracking-wider text-muted">Items</dt>
              <dd className="font-semibold text-primary">{set.items.length}</dd>
            </div>
            <div className="rounded-lg bg-background/50 p-2">
              <dt className="text-[10px] uppercase tracking-wider text-muted">Set Price</dt>
              <dd className="font-semibold text-primary">{formatPrice(set.setPrice)}</dd>
            </div>
            <div className="rounded-lg bg-background/50 p-2">
              <dt className="text-[10px] uppercase tracking-wider text-muted">Savings</dt>
              <dd className="font-semibold text-success">{formatPrice(set.savings)}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
    </AdminScrollPage>
  );
}
