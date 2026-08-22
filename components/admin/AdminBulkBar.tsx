"use client";

import { X } from "lucide-react";
import { Button } from "@/components/common/Button";
import type { BulkActionConfig } from "@/lib/admin/bulk";
import { cn } from "@/lib/utils/cn";

interface AdminBulkBarProps {
  selectedCount: number;
  actions: BulkActionConfig[];
  onAction: (action: BulkActionConfig) => void;
  onClear: () => void;
  loading?: boolean;
}

export function AdminBulkBar({
  selectedCount,
  actions,
  onAction,
  onClear,
  loading = false,
}: AdminBulkBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-3 py-2">
      <span className="text-xs font-semibold text-primary">
        {selectedCount} selected
      </span>
      <div className="hidden h-4 w-px bg-border sm:block" aria-hidden />
      <div className="flex flex-wrap items-center gap-1.5">
        {actions.map((action) => (
          <Button
            key={action.id}
            type="button"
            size="sm"
            variant={action.variant === "danger" ? "outline" : "secondary"}
            disabled={loading}
            onClick={() => onAction(action)}
            className={cn(
              "h-8 px-2.5 text-xs",
              action.variant === "danger" &&
                "border-error/40 text-error hover:border-error hover:bg-error/5 hover:text-error"
            )}
          >
            {action.label}
          </Button>
        ))}
      </div>
      <button
        type="button"
        onClick={onClear}
        disabled={loading}
        className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary/5 hover:text-primary"
        aria-label="Clear selection"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
