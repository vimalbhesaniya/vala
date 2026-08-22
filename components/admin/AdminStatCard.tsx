import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AdminStatCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  className?: string;
}

export function AdminStatCard({
  label,
  value,
  change,
  changeLabel = "vs last period",
  className,
}: AdminStatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const hasChange = change !== undefined;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-soft",
        className
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-primary">
        {value}
      </p>
      {hasChange && (
        <div className="mt-3 flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-success" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-error" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              isPositive ? "text-success" : "text-error"
            )}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
          <span className="text-xs text-muted">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}
