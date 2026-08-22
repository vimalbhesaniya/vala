"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type RevenuePeriod,
} from "@/lib/constants/admin-data";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const PERIOD_OPTIONS: { value: RevenuePeriod; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
  { value: "1y", label: "1Y" },
];

interface RevenueChartProps {
  className?: string;
  defaultPeriod?: RevenuePeriod;
  revenueData?: Record<string, { date: string; revenue: number; orders: number }[]>;
}

function formatChartDate(date: string, period: RevenuePeriod): string {
  const parsed = new Date(date);
  if (period === "7d" || period === "30d") {
    return parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  if (period === "90d" || period === "3m") {
    return parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  return parsed.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload: { orders: number } }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const revenue = payload[0]?.value ?? 0;
  const orders = payload[0]?.payload.orders ?? 0;

  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 shadow-elevated">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-sm font-semibold text-primary">{formatPrice(revenue)}</p>
      <p className="text-xs text-muted">{orders} orders</p>
    </div>
  );
}

export function RevenueChart({
  className,
  defaultPeriod = "30d",
  revenueData = {},
}: RevenueChartProps) {
  const [period, setPeriod] = useState<RevenuePeriod>(defaultPeriod);

  const chartData = useMemo(() => {
    const points = revenueData[period] ?? [];
    return points.map((point) => ({
      ...point,
      label: formatChartDate(point.date, period),
    }));
  }, [period, revenueData]);

  const totalRevenue = chartData.reduce((sum, point) => sum + point.revenue, 0);
  const totalOrders = chartData.reduce((sum, point) => sum + point.orders, 0);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-soft",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-primary">Revenue Overview</h3>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-primary">
            {formatPrice(totalRevenue)}
          </p>
          <p className="mt-0.5 text-xs text-muted">{totalOrders} orders in period</p>
        </div>

        <div className="flex flex-wrap gap-1 rounded-xl bg-background p-1">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriod(option.value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                period === option.value
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-primary/5 hover:text-primary"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C89B5A" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#C89B5A" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#737373", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              tick={{ fill: "#737373", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value: number) =>
                value >= 100000
                  ? `₹${(value / 100000).toFixed(1)}L`
                  : value >= 1000
                    ? `₹${(value / 1000).toFixed(0)}K`
                    : `₹${value}`
              }
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#C89B5A"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
