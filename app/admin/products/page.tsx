"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Plus } from "lucide-react";
import { AdminAgGrid } from "@/components/admin/AdminAgGrid";
import { AdminGridPage } from "@/components/admin/AdminGridPage";
import { createActionsCellRenderer, type GridAction } from "@/components/admin/AgGridActionsCell";
import { createStatusCellRenderer } from "@/components/admin/AgGridStatusCell";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/common/Button";
import { useAdminProducts, useCategories, useAdminMutations } from "@/hooks/use-api";
import { useAdminBulkHandler } from "@/hooks/use-admin-bulk";
import { PRODUCT_BULK_ACTIONS } from "@/lib/admin/bulk";
import { getProductPrice } from "@/types/product";
import type { Product } from "@/types/product";
import { useToast } from "@/components/providers/toast-provider";
import { formatPrice } from "@/lib/utils/format";

interface AdminProductRow {
  id: string;
  name: string;
  schoolName: string;
  categoryName: string;
  categorySlug: string;
  price: number;
  stock: number;
  status: "active" | "archived";
  badge?: string;
}

const PRODUCT_STATUS_CONFIG = [
  { value: "active", label: "Active", variant: "success" as const },
  { value: "archived", label: "Archived", variant: "default" as const },
];

function toAdminRow(product: Product): AdminProductRow {
  const { price } = getProductPrice(product);
  return {
    id: product.id,
    name: product.name,
    schoolName: product.schoolName,
    categoryName: product.categoryName,
    categorySlug: product.categorySlug ?? "",
    price,
    stock: product.variants.reduce((sum, v) => sum + v.stock, 0),
    status: product.status === "archived" ? "archived" : "active",
    badge: product.badge,
  };
}

export default function AdminProductsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { data: productsData, isLoading } = useAdminProducts();
  const { data: categories = [] } = useCategories();
  const { updateProduct, deleteProduct } = useAdminMutations();
  const { handleBulkAction, bulkLoading } = useAdminBulkHandler("products");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deleteTarget, setDeleteTarget] = useState<AdminProductRow | null>(null);

  const products = useMemo(
    () => (productsData?.items ?? []).map(toAdminRow),
    [productsData]
  );

  const filtered = useMemo(
    () =>
      categoryFilter === "all"
        ? products
        : products.filter((p) => p.categorySlug === categoryFilter),
    [products, categoryFilter]
  );

  const gridActions = useMemo<GridAction<AdminProductRow>[]>(
    () => [
      { label: "Edit", onClick: (row) => router.push(`/admin/products/${row.id}/edit`) },
      {
        label: "Archive",
        onClick: (row) => {
          const nextStatus = row.status === "active" ? "archived" : "active";
          updateProduct.mutate(
            { id: row.id, body: { status: nextStatus } },
            {
              onSuccess: () =>
                toast(`Product ${nextStatus === "archived" ? "archived" : "restored"}`),
            }
          );
        },
      },
      { label: "Delete", variant: "danger", onClick: (row) => setDeleteTarget(row) },
    ],
    [router, updateProduct, toast]
  );

  const columnDefs = useMemo<ColDef<AdminProductRow>[]>(
    () => [
      { field: "name", headerName: "Product", filter: "agTextColumnFilter", minWidth: 200 },
      { field: "schoolName", headerName: "School", filter: "agTextColumnFilter" },
      { field: "categoryName", headerName: "Category", filter: "agTextColumnFilter" },
      {
        field: "price",
        headerName: "Price",
        filter: "agNumberColumnFilter",
        valueFormatter: (p) => formatPrice(p.value ?? 0),
        maxWidth: 120,
      },
      { field: "stock", headerName: "Stock", filter: "agNumberColumnFilter", maxWidth: 100 },
      {
        field: "status",
        headerName: "Status",
        filter: "agSetColumnFilter",
        filterParams: { values: ["active", "archived"] },
        cellRenderer: createStatusCellRenderer(PRODUCT_STATUS_CONFIG),
        maxWidth: 130,
      },
      {
        headerName: "Actions",
        sortable: false,
        filter: false,
        floatingFilter: false,
        cellRenderer: createActionsCellRenderer(gridActions),
        width: 100,
        pinned: "right",
      },
    ],
    [gridActions]
  );

  if (isLoading) {
    return <div className="min-h-0 flex-1 animate-pulse rounded-2xl bg-border/40" />;
  }

  return (
    <AdminGridPage
      toolbar={
        <div className="flex flex-wrap items-center justify-between gap-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm">
              <Plus className="h-4 w-4" />
              Create Product
            </Button>
          </Link>
        </div>
      }
    >
      <AdminAgGrid<AdminProductRow>
        rowData={filtered}
        columnDefs={columnDefs}
        getRowId={(row) => row.id}
        quickFilterPlaceholder="Search products, schools, categories..."
        selectable
        bulkActions={PRODUCT_BULK_ACTIONS}
        onBulkAction={handleBulkAction}
        bulkLoading={bulkLoading}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product?"
        description={`Remove "${deleteTarget?.name}" from the catalog? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteTarget) {
            deleteProduct.mutate(deleteTarget.id, {
              onSuccess: () => toast("Product deleted"),
            });
          }
          setDeleteTarget(null);
        }}
        onClose={() => setDeleteTarget(null)}
      />
    </AdminGridPage>
  );
}
