"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AdminAgGrid } from "@/components/admin/AdminAgGrid";
import { AdminGridPage } from "@/components/admin/AdminGridPage";
import { createStatusCellRenderer } from "@/components/admin/AgGridStatusCell";
import { useSchools } from "@/hooks/use-api";
import type { School } from "@/types/school";

const SCHOOL_STATUS_CONFIG = [
  { value: "active", label: "Active", variant: "success" as const },
  { value: "inactive", label: "Inactive", variant: "default" as const },
];

function SchoolLinkCell(params: ICellRendererParams<School>) {
  if (!params.data) return null;
  return (
    <Link
      href={`/admin/schools/${params.data.id}`}
      className="font-medium text-accent hover:underline"
    >
      {params.data.name}
    </Link>
  );
}

export default function AdminSchoolsPage() {
  const { data: schools = [], isLoading } = useSchools();

  const columnDefs = useMemo<ColDef<School>[]>(
    () => [
      {
        field: "name",
        headerName: "School",
        filter: "agTextColumnFilter",
        cellRenderer: SchoolLinkCell,
        minWidth: 200,
      },
      { field: "city", headerName: "City", filter: "agTextColumnFilter" },
      { field: "state", headerName: "State", filter: "agTextColumnFilter" },
      { field: "productCount", headerName: "Products", filter: "agNumberColumnFilter", maxWidth: 120 },
      {
        field: "status",
        headerName: "Status",
        filter: "agSetColumnFilter",
        filterParams: { values: ["active", "inactive"] },
        cellRenderer: createStatusCellRenderer(SCHOOL_STATUS_CONFIG),
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
      <AdminAgGrid<School>
        rowData={schools}
        columnDefs={columnDefs}
        getRowId={(row) => row.id}
        quickFilterPlaceholder="Search schools..."
      />
    </AdminGridPage>
  );
}
