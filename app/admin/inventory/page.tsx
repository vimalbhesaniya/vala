"use client";

import { useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AdminAgGrid } from "@/components/admin/AdminAgGrid";
import { AdminGridPage } from "@/components/admin/AdminGridPage";
import { createActionsCellRenderer, type GridAction } from "@/components/admin/AgGridActionsCell";
import { createStatusCellRenderer } from "@/components/admin/AgGridStatusCell";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { useAdminInventory, useAdminMutations } from "@/hooks/use-api";
import { useAdminBulkHandler } from "@/hooks/use-admin-bulk";
import { INVENTORY_BULK_ACTIONS } from "@/lib/admin/bulk";
import type { InventoryRow } from "@/lib/api/services";
import { useToast } from "@/components/providers/toast-provider";

const INVENTORY_STATUS_CONFIG = [
  { value: "in_stock", label: "In Stock", variant: "success" as const },
  { value: "low_stock", label: "Low Stock", variant: "accent" as const },
  { value: "out_of_stock", label: "Out of Stock", variant: "sale" as const },
];

export default function AdminInventoryPage() {
  const { toast } = useToast();
  const { data: rows = [], isLoading } = useAdminInventory();
  const { updateStock } = useAdminMutations();
  const { handleBulkAction, bulkLoading } = useAdminBulkHandler("inventory", (rows) => ({
    items: (rows as InventoryRow[]).map((row) => ({
      productId: row.productId,
      sku: row.sku,
    })),
    restockQuantity: 10,
  }));
  const [adjustTarget, setAdjustTarget] = useState<InventoryRow | null>(null);
  const [adjustment, setAdjustment] = useState(0);

  const gridActions = useMemo<GridAction<InventoryRow>[]>(
    () => [
      {
        label: "Adjust Stock",
        onClick: (row) => {
          setAdjustTarget(row);
          setAdjustment(0);
        },
      },
    ],
    []
  );

  const columnDefs = useMemo<ColDef<InventoryRow>[]>(
    () => [
      { field: "productName", headerName: "Product", filter: "agTextColumnFilter", minWidth: 180 },
      { field: "sku", headerName: "SKU", filter: "agTextColumnFilter", minWidth: 140 },
      { field: "schoolName", headerName: "School", filter: "agTextColumnFilter" },
      { field: "category", headerName: "Category", filter: "agTextColumnFilter" },
      { field: "size", headerName: "Size", filter: "agTextColumnFilter", maxWidth: 100 },
      { field: "stock", headerName: "Stock", filter: "agNumberColumnFilter", maxWidth: 100 },
      { field: "reserved", headerName: "Reserved", filter: "agNumberColumnFilter", maxWidth: 110 },
      {
        field: "status",
        headerName: "Status",
        filter: "agSetColumnFilter",
        filterParams: { values: ["in_stock", "low_stock", "out_of_stock"] },
        cellRenderer: createStatusCellRenderer(INVENTORY_STATUS_CONFIG),
        maxWidth: 140,
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

  const handleAdjust = () => {
    if (!adjustTarget) return;
    const newStock = Math.max(0, adjustTarget.stock + adjustment);
    updateStock.mutate(
      { productId: adjustTarget.productId, sku: adjustTarget.sku, stock: newStock },
      {
        onSuccess: () => {
          toast(`Stock updated for ${adjustTarget.sku}`);
          setAdjustTarget(null);
          setAdjustment(0);
        },
        onError: (err) => toast(err.message),
      }
    );
  };

  if (isLoading) {
    return <div className="min-h-0 flex-1 animate-pulse rounded-2xl bg-border/40" />;
  }

  return (
    <AdminGridPage>
      <AdminAgGrid<InventoryRow>
        rowData={rows}
        columnDefs={columnDefs}
        getRowId={(row) => row.id}
        quickFilterPlaceholder="Search SKU, product, school..."
        selectable
        bulkActions={INVENTORY_BULK_ACTIONS}
        onBulkAction={handleBulkAction}
        bulkLoading={bulkLoading}
      />

      <Modal open={!!adjustTarget} onClose={() => setAdjustTarget(null)} title="Adjust Stock">
        <div className="space-y-4 p-6">
          {adjustTarget && (
            <>
              <div className="rounded-xl bg-background/50 p-4 text-sm">
                <p className="font-medium text-primary">{adjustTarget.productName}</p>
                <p className="text-muted">
                  {adjustTarget.sku} · Current stock: {adjustTarget.stock}
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium uppercase tracking-wider text-muted">
                  Adjustment (+/- units)
                </label>
                <Input
                  type="number"
                  value={adjustment}
                  onChange={(e) => setAdjustment(Number(e.target.value))}
                />
                <p className="text-xs text-muted">
                  New stock: {Math.max(0, adjustTarget.stock + adjustment)}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setAdjustTarget(null)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAdjust} disabled={updateStock.isPending}>
                  Update Stock
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </AdminGridPage>
  );
}
