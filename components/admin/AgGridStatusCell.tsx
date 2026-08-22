"use client";

import type { CustomCellRendererProps } from "ag-grid-react";
import { cn } from "@/lib/utils/cn";
import type { AdminTableStatusConfig } from "@/components/admin/AdminTable";

const VARIANT_STYLES = {
  default: {
    wrap: "border-border/80 bg-neutral-50 text-neutral-700",
    dot: "bg-neutral-400",
  },
  accent: {
    wrap: "border-accent/30 bg-accent/10 text-[#9a7340]",
    dot: "bg-accent",
  },
  success: {
    wrap: "border-success/25 bg-success/10 text-success",
    dot: "bg-success",
  },
  sale: {
    wrap: "border-error/25 bg-error/10 text-error",
    dot: "bg-error",
  },
  new: {
    wrap: "border-primary/20 bg-primary/8 text-primary",
    dot: "bg-primary",
  },
} as const;

export function AgGridStatusCell({
  value,
  statusConfig,
}: CustomCellRendererProps & { statusConfig: AdminTableStatusConfig[] }) {
  const status = String(value ?? "");
  const match = statusConfig.find((item) => item.value === status);
  const label = match?.label ?? status.replace(/_/g, " ");
  const variant = match?.variant ?? "default";
  const styles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.default;

  return (
    <div className="flex h-full items-center">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium leading-none",
          styles.wrap
        )}
      >
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", styles.dot)} aria-hidden />
        {label}
      </span>
    </div>
  );
}

export function createStatusCellRenderer(statusConfig: AdminTableStatusConfig[]) {
  return function StatusRenderer(props: CustomCellRendererProps) {
    return <AgGridStatusCell {...props} statusConfig={statusConfig} />;
  };
}
