"use client";

import { useMemo, useState } from "react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { Star } from "lucide-react";
import { AdminAgGrid } from "@/components/admin/AdminAgGrid";
import { AdminGridPage } from "@/components/admin/AdminGridPage";
import { createActionsCellRenderer, type GridAction } from "@/components/admin/AgGridActionsCell";
import { createStatusCellRenderer } from "@/components/admin/AgGridStatusCell";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/common/Badge";
import { useAdminReviews, useAdminMutations } from "@/hooks/use-api";
import { useAdminBulkHandler } from "@/hooks/use-admin-bulk";
import { REVIEW_BULK_ACTIONS } from "@/lib/admin/bulk";
import type { Review } from "@/types/review";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils/cn";

type ReviewStatus = "approved" | "hidden" | "pending";
type ReviewRow = Review & { status: ReviewStatus };

const REVIEW_STATUS_CONFIG = [
  { value: "approved", label: "Approved", variant: "success" as const },
  { value: "hidden", label: "Hidden", variant: "default" as const },
  { value: "pending", label: "Pending", variant: "accent" as const },
];

function StarRatingCell(params: ICellRendererParams<ReviewRow>) {
  const rating = params.value ?? 0;
  return (
    <div className="flex h-full items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "h-3.5 w-3.5",
            index < rating ? "fill-accent text-accent" : "text-border"
          )}
        />
      ))}
    </div>
  );
}

function CustomerCell(params: ICellRendererParams<ReviewRow>) {
  if (!params.data) return null;
  return (
    <div className="py-1">
      <p className="font-medium text-primary">{params.data.customerName}</p>
      {params.data.verified && <Badge variant="success">Verified</Badge>}
    </div>
  );
}

export default function AdminReviewsPage() {
  const { toast } = useToast();
  const { data: reviews = [], isLoading } = useAdminReviews();
  const { updateReview, deleteReview } = useAdminMutations();
  const { handleBulkAction, bulkLoading } = useAdminBulkHandler("reviews");
  const [deleteTarget, setDeleteTarget] = useState<ReviewRow | null>(null);

  const rows: ReviewRow[] = useMemo(
    () =>
      reviews.map((r) => ({
        ...r,
        status: (r.status ?? "approved") as ReviewStatus,
      })),
    [reviews]
  );

  const gridActions = useMemo<GridAction<ReviewRow>[]>(
    () => [
      {
        label: "Approve",
        onClick: (row) => {
          updateReview.mutate(
            { id: row.id, body: { status: "approved" } },
            { onSuccess: () => toast("Review approved") }
          );
        },
      },
      {
        label: "Hide",
        onClick: (row) => {
          updateReview.mutate(
            { id: row.id, body: { status: "hidden" } },
            { onSuccess: () => toast("Review hidden") }
          );
        },
      },
      { label: "Delete", variant: "danger", onClick: (row) => setDeleteTarget(row) },
    ],
    [updateReview, toast]
  );

  const columnDefs = useMemo<ColDef<ReviewRow>[]>(
    () => [
      {
        field: "customerName",
        headerName: "Customer",
        filter: "agTextColumnFilter",
        cellRenderer: CustomerCell,
        minWidth: 160,
      },
      { field: "productName", headerName: "Product", filter: "agTextColumnFilter" },
      { field: "schoolName", headerName: "School", filter: "agTextColumnFilter" },
      {
        field: "rating",
        headerName: "Rating",
        filter: "agNumberColumnFilter",
        cellRenderer: StarRatingCell,
        maxWidth: 120,
      },
      { field: "comment", headerName: "Review", filter: "agTextColumnFilter", minWidth: 200 },
      { field: "createdAt", headerName: "Date", filter: "agDateColumnFilter", maxWidth: 120 },
      {
        field: "status",
        headerName: "Status",
        filter: "agSetColumnFilter",
        filterParams: { values: ["approved", "hidden", "pending"] },
        cellRenderer: createStatusCellRenderer(REVIEW_STATUS_CONFIG),
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
    <AdminGridPage>
      <AdminAgGrid<ReviewRow>
        rowData={rows}
        columnDefs={columnDefs}
        getRowId={(row) => row.id}
        quickFilterPlaceholder="Search reviews..."
        selectable
        bulkActions={REVIEW_BULK_ACTIONS}
        onBulkAction={handleBulkAction}
        bulkLoading={bulkLoading}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteReview.mutate(deleteTarget.id, {
              onSuccess: () => toast("Review deleted"),
            });
          }
          setDeleteTarget(null);
        }}
        title="Delete Review"
        description="Are you sure you want to permanently delete this review?"
        confirmLabel="Delete"
      />
    </AdminGridPage>
  );
}
