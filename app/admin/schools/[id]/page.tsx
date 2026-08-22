"use client";

import { use, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AdminAgGrid } from "@/components/admin/AdminAgGrid";
import { createStatusCellRenderer } from "@/components/admin/AgGridStatusCell";
import { AdminTableStatusBadge } from "@/components/admin/AdminTable";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { PageHeader } from "@/components/common/PageHeader";
import {
  useSchools,
  useSchool,
  useProducts,
  useUniformSets,
  useAdminOrders,
} from "@/hooks/use-api";
import { ORDER_STATUS_TABLE_CONFIG } from "@/lib/admin/orders";
import { getProductPrice } from "@/types/product";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const TABS = ["Overview", "Products", "Uniform Sets", "Orders"] as const;
type Tab = (typeof TABS)[number];

interface SchoolOrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
}

function OrderLinkCell(params: ICellRendererParams<SchoolOrderRow>) {
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

export default function AdminSchoolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: allSchools = [] } = useSchools();
  const schoolMeta = allSchools.find((s) => s.id === id);
  const { data: school, isLoading: schoolLoading } = useSchool(schoolMeta?.slug ?? "");
  const { data: productsData } = useProducts(
    { school: schoolMeta?.slug ?? "", limit: 100 },
    !!schoolMeta?.slug
  );
  const { data: uniformSets = [] } = useUniformSets(schoolMeta?.slug);
  const { data: allOrders = [] } = useAdminOrders();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const schoolProducts = productsData?.items ?? [];

  const schoolOrders = useMemo(
    () =>
      allOrders
        .filter((order) =>
          order.items.some((item) => item.schoolName === school?.name)
        )
        .map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          total: order.total,
          status: order.status,
        })),
    [allOrders, school?.name]
  );

  const productColumnDefs = useMemo<ColDef<Product>[]>(
    () => [
      { field: "name", headerName: "Product", filter: "agTextColumnFilter", minWidth: 200 },
      { field: "categoryName", headerName: "Category", filter: "agTextColumnFilter" },
      {
        colId: "price",
        headerName: "Price",
        filter: "agNumberColumnFilter",
        valueGetter: (p) => (p.data ? getProductPrice(p.data).price : 0),
        valueFormatter: (p) => formatPrice(p.value ?? 0),
        maxWidth: 120,
      },
    ],
    []
  );

  const orderColumnDefs = useMemo<ColDef<SchoolOrderRow>[]>(
    () => [
      {
        field: "orderNumber",
        headerName: "Order",
        filter: "agTextColumnFilter",
        cellRenderer: OrderLinkCell,
        minWidth: 140,
      },
      { field: "customerName", headerName: "Customer", filter: "agTextColumnFilter" },
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
    ],
    []
  );

  if (schoolLoading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-border/40" />;
  }

  if (!school) notFound();

  const isGridTab = activeTab === "Products" || activeTab === "Orders";

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", !isGridTab && "overflow-y-auto overscroll-contain")}>
      <div className="shrink-0">
      <PageHeader title={school.name} description={`${school.city}, ${school.state}`}>
        <Link href="/admin/schools">
          <Button variant="outline" size="sm">
            ← Back to Schools
          </Button>
        </Link>
      </PageHeader>

      <div className="mb-8 flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white p-2">
          <Image src={school.logo} alt={school.name} fill className="object-contain" sizes="64px" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <AdminTableStatusBadge
              status={school.status}
              config={[
                { value: "active", label: "Active", variant: "success" },
                { value: "inactive", label: "Inactive", variant: "default" },
              ]}
            />
            <Badge variant="accent">{schoolProducts.length} products</Badge>
          </div>
          {school.description && (
            <p className="mt-2 text-sm text-muted">{school.description}</p>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-1 rounded-xl bg-background p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab
                ? "bg-primary text-white"
                : "text-muted hover:bg-primary/5 hover:text-primary"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      </div>

      {activeTab === "Overview" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Products" value={String(schoolProducts.length)} />
          <StatCard label="Orders" value={String(schoolOrders.length)} />
          <StatCard label="City" value={school.city} />
        </div>
      )}

      {activeTab === "Products" && (
        <div className="min-h-0 flex-1">
        <AdminAgGrid<Product>
          rowData={schoolProducts}
          columnDefs={productColumnDefs}
          getRowId={(row) => row.id}
          quickFilterPlaceholder="Search products..."
        />
        </div>
      )}

      {activeTab === "Uniform Sets" && (
        <div className="space-y-4">
          {uniformSets.length === 0 ? (
            <p className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted shadow-soft">
              No uniform sets configured for this school yet.
            </p>
          ) : (
            uniformSets.map((set) => (
              <div
                key={set.id}
                className="rounded-2xl border border-border bg-surface p-6 shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-primary">
                      {set.grade} · {set.gender} Uniform Set
                    </h3>
                    <p className="mt-1 text-xs text-muted">{set.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-primary">
                      {formatPrice(set.setPrice)}
                    </p>
                    <p className="text-xs text-success">
                      Save {formatPrice(set.savings)} vs individual
                    </p>
                  </div>
                </div>
                <ul className="mt-4 divide-y divide-border">
                  {set.items.map((item) => (
                    <li key={item.name} className="flex justify-between py-3 text-sm">
                      <span>{item.name}</span>
                      <span className="text-muted">{formatPrice(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "Orders" && (
        <div className="min-h-0 flex-1">
        <AdminAgGrid<SchoolOrderRow>
          rowData={schoolOrders}
          columnDefs={orderColumnDefs}
          getRowId={(row) => row.id}
          quickFilterPlaceholder="Filter school orders..."
        />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
    </div>
  );
}
