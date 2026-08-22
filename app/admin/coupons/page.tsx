"use client";

import { useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Plus } from "lucide-react";
import { AdminAgGrid } from "@/components/admin/AdminAgGrid";
import { AdminGridPage } from "@/components/admin/AdminGridPage";
import { createActionsCellRenderer, type GridAction } from "@/components/admin/AgGridActionsCell";
import { createStatusCellRenderer } from "@/components/admin/AgGridStatusCell";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { useAdminCoupons, useAdminMutations } from "@/hooks/use-api";
import { useAdminBulkHandler } from "@/hooks/use-admin-bulk";
import { COUPON_BULK_ACTIONS } from "@/lib/admin/bulk";
import type { AdminCoupon } from "@/lib/api/services";
import { useToast } from "@/components/providers/toast-provider";
import { formatPrice } from "@/lib/utils/format";

const COUPON_STATUS_CONFIG = [
  { value: "active", label: "Active", variant: "success" as const },
  { value: "expired", label: "Expired", variant: "sale" as const },
  { value: "scheduled", label: "Scheduled", variant: "accent" as const },
];

function CodeCell(params: ICellRendererParams<AdminCoupon>) {
  return (
    <span className="font-mono font-semibold text-accent">{params.value}</span>
  );
}

export default function AdminCouponsPage() {
  const { toast } = useToast();
  const { data: coupons = [], isLoading } = useAdminCoupons();
  const { createCoupon, updateCoupon, deleteCoupon } = useAdminMutations();
  const { handleBulkAction, bulkLoading } = useAdminBulkHandler("coupons");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminCoupon | null>(null);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage" as AdminCoupon["discountType"],
    discountValue: 10,
    minOrder: 999,
    usageLimit: 100,
    expiresAt: "",
  });

  const gridActions = useMemo<GridAction<AdminCoupon>[]>(
    () => [
      {
        label: "Deactivate",
        onClick: (row) => {
          updateCoupon.mutate(
            { id: row.id, body: { status: "expired" } },
            { onSuccess: () => toast(`Coupon ${row.code} deactivated`) }
          );
        },
      },
      { label: "Delete", variant: "danger", onClick: (row) => setDeleteTarget(row) },
    ],
    [updateCoupon, toast]
  );

  const columnDefs = useMemo<ColDef<AdminCoupon>[]>(
    () => [
      {
        field: "code",
        headerName: "Code",
        filter: "agTextColumnFilter",
        cellRenderer: CodeCell,
        minWidth: 130,
      },
      { field: "description", headerName: "Description", filter: "agTextColumnFilter" },
      {
        field: "discountValue",
        headerName: "Discount",
        filter: "agNumberColumnFilter",
        valueGetter: (p) => {
          const row = p.data;
          if (!row) return "";
          return row.discountType === "percentage"
            ? `${row.discountValue}%`
            : formatPrice(row.discountValue);
        },
        maxWidth: 120,
      },
      {
        colId: "usage",
        headerName: "Usage",
        valueGetter: (p) =>
          p.data ? `${p.data.usageCount} / ${p.data.usageLimit}` : "",
        filter: "agTextColumnFilter",
        maxWidth: 120,
      },
      {
        field: "minOrder",
        headerName: "Min Order",
        filter: "agNumberColumnFilter",
        valueFormatter: (p) => formatPrice(p.value ?? 0),
        maxWidth: 120,
      },
      {
        field: "status",
        headerName: "Status",
        filter: "agSetColumnFilter",
        filterParams: { values: ["active", "expired", "scheduled"] },
        cellRenderer: createStatusCellRenderer(COUPON_STATUS_CONFIG),
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

  const handleCreate = () => {
    if (!form.code.trim()) return;
    createCoupon.mutate(
      {
        code: form.code.toUpperCase(),
        description: form.description,
        discountType: form.discountType,
        discountValue: form.discountValue,
        minOrder: form.minOrder,
        usageLimit: form.usageLimit,
        expiresAt: form.expiresAt || undefined,
      },
      {
        onSuccess: () => {
          toast("Coupon created successfully");
          setModalOpen(false);
          setForm({
            code: "",
            description: "",
            discountType: "percentage",
            discountValue: 10,
            minOrder: 999,
            usageLimit: 100,
            expiresAt: "",
          });
        },
        onError: (err) => toast(err.message),
      }
    );
  };

  if (isLoading) {
    return <div className="min-h-0 flex-1 animate-pulse rounded-2xl bg-border/40" />;
  }

  return (
    <AdminGridPage
      toolbar={
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Coupon
          </Button>
        </div>
      }
    >
      <AdminAgGrid<AdminCoupon>
        rowData={coupons}
        columnDefs={columnDefs}
        getRowId={(row) => row.id}
        quickFilterPlaceholder="Search coupons..."
        selectable
        bulkActions={COUPON_BULK_ACTIONS}
        onBulkAction={handleBulkAction}
        bulkLoading={bulkLoading}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Coupon">
        <div className="space-y-4 p-6">
          <Field label="Coupon Code">
            <Input
              value={form.code}
              onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
              placeholder="BACK2SCHOOL"
            />
          </Field>
          <Field label="Description">
            <Input
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Seasonal discount"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Discount Type">
              <select
                value={form.discountType}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    discountType: e.target.value as AdminCoupon["discountType"],
                  }))
                }
                className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm focus:border-primary focus:outline-none"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </Field>
            <Field label="Discount Value">
              <Input
                type="number"
                value={form.discountValue}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, discountValue: Number(e.target.value) }))
                }
              />
            </Field>
            <Field label="Min Order (INR)">
              <Input
                type="number"
                value={form.minOrder}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, minOrder: Number(e.target.value) }))
                }
              />
            </Field>
            <Field label="Usage Limit">
              <Input
                type="number"
                value={form.usageLimit}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, usageLimit: Number(e.target.value) }))
                }
              />
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate} disabled={createCoupon.isPending}>
              Create Coupon
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteCoupon.mutate(deleteTarget.id, {
              onSuccess: () => toast(`Deleted coupon ${deleteTarget.code}`),
            });
          }
          setDeleteTarget(null);
        }}
        title="Delete Coupon"
        description={`Delete coupon "${deleteTarget?.code}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </AdminGridPage>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted">{label}</label>
      {children}
    </div>
  );
}
