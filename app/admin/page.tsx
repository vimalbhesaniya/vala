"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, AlertTriangle, RefreshCw } from "lucide-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminAgGrid } from "@/components/admin/AdminAgGrid";
import { AdminScrollPage } from "@/components/admin/AdminGridPage";
import { createStatusCellRenderer } from "@/components/admin/AgGridStatusCell";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { Button } from "@/components/common/Button";
import { useAdminDashboard } from "@/hooks/use-api";
import { ORDER_STATUS_TABLE_CONFIG } from "@/lib/admin/orders";
import { formatPrice } from "@/lib/utils/format";

interface RecentOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  schoolName: string;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

function DashboardOrderLinkCell(params: ICellRendererParams<RecentOrderRow>) {
  if (!params.data) return null;
  return (
    <Link
      href={`/admin/orders/${params.data.id}`}
      className="font-medium text-accent hover:underline"
    >
      {params.value}
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useAdminDashboard();

  const recentOrderColumns = useMemo<ColDef<RecentOrderRow>[]>(
    () => [
      {
        field: "orderNumber",
        headerName: "Order",
        filter: "agTextColumnFilter",
        cellRenderer: DashboardOrderLinkCell,
        minWidth: 130,
      },
      { field: "customerName", headerName: "Customer", filter: "agTextColumnFilter" },
      { field: "schoolName", headerName: "School", filter: "agTextColumnFilter" },
      {
        field: "total",
        headerName: "Total",
        filter: "agNumberColumnFilter",
        valueFormatter: (p) => formatPrice(p.value ?? 0),
        maxWidth: 120,
      },
      {
        field: "status",
        headerName: "Status",
        filter: "agSetColumnFilter",
        filterParams: { values: ORDER_STATUS_TABLE_CONFIG.map((s) => s.value) },
        cellRenderer: createStatusCellRenderer(ORDER_STATUS_TABLE_CONFIG),
        maxWidth: 150,
      },
      {
        field: "createdAt",
        headerName: "Date",
        filter: "agDateColumnFilter",
        valueFormatter: (p) =>
          p.value
            ? new Date(String(p.value)).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—",
        maxWidth: 120,
      },
    ],
    []
  );

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-border/40" />;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-16 text-center shadow-soft">
        <p className="text-sm font-medium text-primary">Could not load dashboard</p>
        <p className="mt-1 text-xs text-muted">
          {error instanceof Error ? error.message : "Please sign in as admin and try again."}
        </p>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
          <Link href="/admin/login">
            <Button size="sm">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AdminScrollPage>
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <AdminStatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            changeLabel={stat.changeLabel}
          />
        ))}
      </div>

      <RevenueChart revenueData={data.revenueData} />

      <section>
        <h2 className="mb-4 text-sm font-semibold text-primary">Orders by Status</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.orderStatusCounts.map((item) => (
            <div
              key={item.status}
              className="rounded-2xl border border-border bg-surface p-4 shadow-soft"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  {item.label}
                </p>
              </div>
              <p className="mt-2 text-2xl font-semibold text-primary">{item.count}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="text-sm font-semibold text-primary">Top Products</h2>
          <ul className="mt-4 space-y-3">
            {data.topProducts.map((product, index) => (
              <li
                key={product.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/30 p-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/5 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                {product.image && (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-[#f0efec]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-primary">{product.name}</p>
                  <p className="text-xs text-muted">{product.schoolName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">
                    {formatPrice(product.revenue)}
                  </p>
                  <p className="text-xs text-muted">{product.unitsSold} sold</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
          <h2 className="text-sm font-semibold text-primary">Top Schools</h2>
          <ul className="mt-4 space-y-3">
            {data.topSchools.map((school, index) => (
              <li
                key={school.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/30 p-3"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                  {index + 1}
                </span>
                {school.logo && (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white p-1">
                    <Image
                      src={school.logo}
                      alt={school.name}
                      fill
                      className="object-contain p-1"
                      sizes="40px"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-primary">{school.name}</p>
                  <p className="text-xs text-muted">{school.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">
                    {formatPrice(school.revenue)}
                  </p>
                  <p className="text-xs text-muted">{school.orders} orders</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold text-primary">Low Stock Alert</h2>
          </div>
          <Link href="/admin/inventory">
            <Button variant="outline" size="sm">
              View Inventory
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-border">
          {data.lowStockItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-3 first:pt-0">
              <div>
                <p className="text-sm font-medium text-primary">{item.productName}</p>
                <p className="text-xs text-muted">
                  {item.sku} · Size {item.size} · {item.schoolName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-error">{item.stock} left</p>
                <p className="text-xs text-muted">Threshold: {item.threshold}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-primary">Recent Orders</h2>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              View All Orders
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <AdminAgGrid<RecentOrderRow>
          rowData={data.recentOrders}
          columnDefs={recentOrderColumns}
          getRowId={(row) => row.id}
          quickFilterPlaceholder="Filter recent orders..."
          pageSize={10}
          fillHeight={false}
          height={380}
        />
      </section>
    </div>
    </AdminScrollPage>
  );
}
