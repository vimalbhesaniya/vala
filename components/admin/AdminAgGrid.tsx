"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
  type ColDef,
  type SelectionChangedEvent,
} from "ag-grid-community";
import { Search } from "lucide-react";
import { AdminBulkBar } from "@/components/admin/AdminBulkBar";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Input } from "@/components/common/Input";
import type { BulkActionConfig } from "@/lib/admin/bulk";
import { cn } from "@/lib/utils/cn";

ModuleRegistry.registerModules([AllCommunityModule]);

const valaGridTheme = themeQuartz.withParams({
  accentColor: "#C89B5A",
  backgroundColor: "#ffffff",
  foregroundColor: "#111111",
  borderColor: "#e5e5e5",
  browserColorScheme: "light",
  fontFamily: "inherit",
  fontSize: 13,
  headerBackgroundColor: "#fafaf8",
  headerFontWeight: 600,
  rowHoverColor: "rgba(17, 17, 17, 0.03)",
  spacing: 8,
  wrapperBorderRadius: 16,
});

export interface AdminAgGridProps<T> {
  rowData: T[];
  columnDefs: ColDef<T>[];
  getRowId: (data: T) => string;
  context?: Record<string, unknown>;
  height?: number;
  fillHeight?: boolean;
  pageSize?: number;
  loading?: boolean;
  quickFilterPlaceholder?: string;
  className?: string;
  domLayout?: "normal" | "autoHeight";
  selectable?: boolean;
  bulkActions?: BulkActionConfig[];
  onBulkAction?: (
    action: BulkActionConfig,
    selectedRows: T[]
  ) => void | Promise<void>;
  bulkLoading?: boolean;
}

export function AdminAgGrid<T>({
  rowData,
  columnDefs,
  getRowId,
  context,
  height = 480,
  fillHeight = true,
  pageSize = 15,
  loading = false,
  quickFilterPlaceholder = "Quick filter all columns...",
  className,
  domLayout = "normal",
  selectable = false,
  bulkActions = [],
  onBulkAction,
  bulkLoading = false,
}: AdminAgGridProps<T>) {
  const gridRef = useRef<AgGridReact<T>>(null);
  const gridAreaRef = useRef<HTMLDivElement>(null);
  const [quickFilter, setQuickFilter] = useState("");
  const [measuredHeight, setMeasuredHeight] = useState(height);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [pendingAction, setPendingAction] = useState<BulkActionConfig | null>(null);

  const useFillHeight = fillHeight && domLayout === "normal";
  const hasBulk = selectable && bulkActions.length > 0 && !!onBulkAction;

  useEffect(() => {
    if (!useFillHeight) {
      setMeasuredHeight(height);
      return;
    }

    const node = gridAreaRef.current;
    if (!node) return;

    const updateHeight = () => {
      const nextHeight = Math.floor(node.getBoundingClientRect().height);
      if (nextHeight > 0) {
        setMeasuredHeight(nextHeight);
      }
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    window.addEventListener("resize", updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [useFillHeight, height]);

  useEffect(() => {
    if (measuredHeight > 0) {
      gridRef.current?.api?.sizeColumnsToFit();
    }
  }, [measuredHeight]);

  const defaultColDef = useMemo<ColDef<T>>(
    () => ({
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
      minWidth: 110,
      flex: 1,
    }),
    []
  );

  const onGridReady = () => {
    gridRef.current?.api?.sizeColumnsToFit();
  };

  const onFilterTextChange = (value: string) => {
    setQuickFilter(value);
    gridRef.current?.api?.setGridOption("quickFilterText", value);
  };

  const clearSelection = useCallback(() => {
    gridRef.current?.api?.deselectAll();
    setSelectedRows([]);
  }, []);

  const onSelectionChanged = useCallback((event: SelectionChangedEvent<T>) => {
    setSelectedRows(event.api.getSelectedRows());
  }, []);

  const handleConfirmBulk = async () => {
    if (!pendingAction || selectedRows.length === 0) return;
    try {
      await onBulkAction?.(pendingAction, selectedRows);
      setPendingAction(null);
      clearSelection();
    } catch {
      setPendingAction(null);
    }
  };

  const gridStyle =
    domLayout === "autoHeight" ? undefined : { height: useFillHeight ? measuredHeight : height };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft",
        useFillHeight && "h-full min-h-0 flex-1",
        className
      )}
    >
      <div className="shrink-0 space-y-3 border-b border-border p-4">
        {hasBulk && (
          <AdminBulkBar
            selectedCount={selectedRows.length}
            actions={bulkActions}
            onAction={setPendingAction}
            onClear={clearSelection}
            loading={bulkLoading}
          />
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder={quickFilterPlaceholder}
            value={quickFilter}
            onChange={(e) => onFilterTextChange(e.target.value)}
            className="h-10 max-w-md"
          />
          <p className="text-xs text-muted">
            {rowData.length} record{rowData.length !== 1 ? "s" : ""}
            {selectable ? " · select rows for bulk actions" : " · column filters enabled"}
          </p>
        </div>
      </div>

      <div
        ref={gridAreaRef}
        className={cn("ag-theme-quartz w-full", useFillHeight && "min-h-0 flex-1")}
        style={gridStyle}
      >
        <AgGridReact<T>
          ref={gridRef}
          theme={valaGridTheme}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          context={context}
          getRowId={(params) => (params.data ? getRowId(params.data) : String(params.level))}
          pagination
          paginationPageSize={pageSize}
          paginationPageSizeSelector={[10, 15, 25, 50, 100]}
          animateRows
          loading={loading}
          domLayout={domLayout}
          onGridReady={onGridReady}
          onSelectionChanged={selectable ? onSelectionChanged : undefined}
          suppressCellFocus
          rowSelection={
            selectable
              ? { mode: "multiRow", checkboxes: true, headerCheckbox: true }
              : { mode: "singleRow", checkboxes: false }
          }
          popupParent={typeof document !== "undefined" ? document.body : undefined}
        />
      </div>

      {hasBulk && (
        <ConfirmDialog
          open={!!pendingAction}
          onClose={() => setPendingAction(null)}
          onConfirm={handleConfirmBulk}
          title={pendingAction?.confirmTitle ?? "Confirm"}
          description={
            pendingAction
              ? pendingAction.confirmDescription(selectedRows.length)
              : ""
          }
          confirmLabel={pendingAction?.label ?? "Confirm"}
          variant={pendingAction?.variant === "danger" ? "danger" : "default"}
          loading={bulkLoading}
        />
      )}
    </div>
  );
}

export type { ColDef };
