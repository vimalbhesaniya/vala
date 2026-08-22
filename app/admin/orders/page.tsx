"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AdminAgGrid } from "@/components/admin/AdminAgGrid";
import { AdminGridPage } from "@/components/admin/AdminGridPage";
import { createActionsCellRenderer, type GridAction } from "@/components/admin/AgGridActionsCell";
import { createStatusCellRenderer } from "@/components/admin/AgGridStatusCell";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminOrders, useOrderMutations } from "@/hooks/use-api";
import { useAdminBulkHandler } from "@/hooks/use-admin-bulk";
import { ORDER_BULK_ACTIONS } from "@/lib/admin/bulk";
import { ORDER_STATUS_TABLE_CONFIG } from "@/lib/admin/orders";
import { useToast } from "@/components/providers/toast-provider";
import { formatPrice } from "@/lib/utils/format";

interface OrderRow {
  id: string;
  orderNumber: string;
  customerName: string;
  schoolName: string;
  itemCount: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

function OrderLinkCell(params: ICellRendererParams<OrderRow>) {
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

export default function AdminOrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: orders = [], isLoading } = useAdminOrders();
  const { deleteOrder } = useOrderMutations();
  const { handleBulkAction, bulkLoading } = useAdminBulkHandler("orders");
  const [deleteTarget, setDeleteTarget] = useState<OrderRow | null>(null);

  const rows: OrderRow[] = useMemo(
    () =>
      orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        schoolName: order.items[0]?.schoolName ?? "—",
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
        total: order.total,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      })),
    [orders]
  );

  const gridActions = useMemo<GridAction<OrderRow>[]>(
    () => [
      { label: "View", onClick: (row) => router.push(`/admin/orders/${row.id}`) },
      { label: "Delete", variant: "danger", onClick: (row) => setDeleteTarget(row) },
    ],
    [router]
  );

  const columnDefs = useMemo<ColDef<OrderRow>[]>(
    () => [
      {
        field: "orderNumber",
        headerName: "Order",
        filter: "agTextColumnFilter",
        cellRenderer: OrderLinkCell,
        minWidth: 140,
      },
      {
        field: "customerName",
        headerName: "Customer",
        filter: "agTextColumnFilter",
        minWidth: 160,
      },
      {
        field: "schoolName",
        headerName: "School",
        filter: "agTextColumnFilter",
        minWidth: 160,
      },
      {
        field: "itemCount",
        headerName: "Items",
        filter: "agNumberColumnFilter",
        maxWidth: 110,
      },
      {
        field: "total",
        headerName: "Amount",
        filter: "agNumberColumnFilter",
        valueFormatter: (p) => formatPrice(p.value ?? 0),
        maxWidth: 130,
      },
      {
        field: "status",
        headerName: "Status",
        filter: "agSetColumnFilter",
        filterParams: {
          values: ORDER_STATUS_TABLE_CONFIG.map((s) => s.value),
        },
        cellRenderer: createStatusCellRenderer(ORDER_STATUS_TABLE_CONFIG),
        maxWidth: 160,
      },
      {
        field: "paymentStatus",
        headerName: "Payment",
        filter: "agSetColumnFilter",
        filterParams: { values: ["pending", "paid", "failed", "refunded"] },
        maxWidth: 130,
      },
      {
        field: "createdAt",
        headerName: "Date",
        filter: "agDateColumnFilter",
        minWidth: 120,
      },
      {
        headerName: "Actions",
        sortable: false,
        filter: false,
        floatingFilter: false,
        cellRenderer: createActionsCellRenderer(gridActions),
        width: 100,
        maxWidth: 100,
        pinned: "right",
      },
    ],
    [gridActions]
  );

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    deleteOrder.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast(`Order ${deleteTarget.orderNumber} deleted`);
        setDeleteTarget(null);
      },
      onError: (err) => toast(err.message),
    });
  }, [deleteTarget, deleteOrder, toast]);

  if (isLoading) {
    return <div className="min-h-0 flex-1 animate-pulse rounded-2xl bg-border/40" />;
  }

  return (
    <AdminGridPage>
      <AdminAgGrid<OrderRow>
        rowData={rows}
        columnDefs={columnDefs}
        getRowId={(row) => row.id}
        quickFilterPlaceholder="Search orders, customers, schools..."
        pageSize={20}
        selectable
        bulkActions={ORDER_BULK_ACTIONS}
        onBulkAction={handleBulkAction}
        bulkLoading={bulkLoading}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Order"
        description={`Permanently delete order "${deleteTarget?.orderNumber}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteOrder.isPending}
      />
    </AdminGridPage>
  );
}
