"use client";

import { useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { AdminAgGrid } from "@/components/admin/AdminAgGrid";
import { AdminGridPage } from "@/components/admin/AdminGridPage";
import { createStatusCellRenderer } from "@/components/admin/AgGridStatusCell";
import { useAdminCustomers } from "@/hooks/use-api";
import type { AdminCustomer } from "@/lib/api/services";
import { formatPrice } from "@/lib/utils/format";

const CUSTOMER_STATUS_CONFIG = [
  { value: "active", label: "Active", variant: "success" as const },
  { value: "inactive", label: "Inactive", variant: "default" as const },
];

export default function AdminCustomersPage() {
  const { data: customers = [], isLoading } = useAdminCustomers();

  const columnDefs = useMemo<ColDef<AdminCustomer>[]>(
    () => [
      { field: "name", headerName: "Name", filter: "agTextColumnFilter", minWidth: 160 },
      { field: "email", headerName: "Email", filter: "agTextColumnFilter", minWidth: 200 },
      { field: "phone", headerName: "Phone", filter: "agTextColumnFilter" },
      { field: "city", headerName: "City", filter: "agTextColumnFilter" },
      { field: "orders", headerName: "Orders", filter: "agNumberColumnFilter", maxWidth: 110 },
      {
        field: "totalSpent",
        headerName: "Total Spent",
        filter: "agNumberColumnFilter",
        valueFormatter: (p) => formatPrice(p.value ?? 0),
        minWidth: 130,
      },
      {
        field: "lastOrderAt",
        headerName: "Last Order",
        filter: "agDateColumnFilter",
        valueFormatter: (p) =>
          p.value
            ? new Date(String(p.value)).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—",
        minWidth: 130,
      },
      {
        field: "status",
        headerName: "Status",
        filter: "agSetColumnFilter",
        filterParams: { values: ["active", "inactive"] },
        cellRenderer: createStatusCellRenderer(CUSTOMER_STATUS_CONFIG),
        maxWidth: 130,
      },
    ],
    []
  );

  if (isLoading) {
    return <div className="min-h-0 flex-1 animate-pulse rounded-2xl bg-border/40" />;
  }

  return (
    <AdminGridPage>
      <AdminAgGrid<AdminCustomer>
        rowData={customers}
        columnDefs={columnDefs}
        getRowId={(row) => row.id}
        quickFilterPlaceholder="Search customers..."
      />
    </AdminGridPage>
  );
}
