"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { cn } from "@/lib/utils/cn";

export interface AdminTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  mobileLabel?: string;
  hideOnMobile?: boolean;
  searchable?: boolean;
  className?: string;
}

export interface AdminTableAction<T> {
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "danger";
}

export interface AdminTableStatusConfig {
  value: string;
  label: string;
  variant?: "default" | "accent" | "success" | "sale" | "new";
}

interface AdminTableProps<T> {
  data: T[];
  columns: AdminTableColumn<T>[];
  actions?: AdminTableAction<T>[];
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  pageSize?: number;
  emptyMessage?: string;
  getRowId: (row: T) => string;
  statusConfig?: AdminTableStatusConfig[];
  className?: string;
}

export function AdminTableStatusBadge({
  status,
  config,
}: {
  status: string;
  config: AdminTableStatusConfig[];
}) {
  const match = config.find((item) => item.value === status);
  const label = match?.label ?? status.replace(/_/g, " ");
  const variant = match?.variant ?? "default";

  return <Badge variant={variant}>{label}</Badge>;
}

function ActionMenu<T>({
  row,
  actions,
}: {
  row: T;
  actions: AdminTableAction<T>[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary/5 hover:text-primary"
        aria-label="Row actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 min-w-[140px] rounded-xl border border-border bg-surface py-1 shadow-elevated">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                action.onClick(row);
                setOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-primary/5",
                action.variant === "danger"
                  ? "text-error hover:bg-error/5"
                  : "text-primary"
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdminTable<T>({
  data,
  columns,
  actions,
  searchPlaceholder = "Search...",
  searchKeys,
  pageSize = 10,
  emptyMessage = "No records found.",
  getRowId,
  className,
}: AdminTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;

    const query = search.toLowerCase();
    const keys =
      searchKeys ??
      (columns
        .filter((col) => col.searchable !== false)
        .map((col) => col.key) as (keyof T)[]);

    return data.filter((row) =>
      keys.some((key) => {
        const value = row[key];
        return String(value ?? "")
          .toLowerCase()
          .includes(query);
      })
    );
  }, [data, search, searchKeys, columns]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const mobileColumns = columns.filter((col) => !col.hideOnMobile);

  return (
    <div className={cn("rounded-2xl border border-border bg-surface shadow-soft", className)}>
      <div className="border-b border-border p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            icon={<Search className="h-4 w-4" />}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="h-10 max-w-sm"
          />
          <p className="text-xs text-muted">
            {filteredData.length} record{filteredData.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border bg-background/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions?.length ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={getRowId(row)}
                  className="border-b border-border last:border-0 hover:bg-background/40"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn("px-4 py-3.5 text-sm text-primary", column.className)}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="px-4 py-3.5 text-right">
                      <ActionMenu row={row} actions={actions} />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="space-y-3 p-4 md:hidden">
        {paginatedData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">{emptyMessage}</p>
        ) : (
          paginatedData.map((row) => (
            <div
              key={getRowId(row)}
              className="rounded-xl border border-border bg-background/30 p-4"
            >
              <div className="space-y-2">
                {mobileColumns.map((column) => (
                  <div key={column.key} className="flex items-start justify-between gap-3">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted">
                      {column.mobileLabel ?? column.header}
                    </span>
                    <div className="text-right text-sm text-primary">
                      {column.cell(row)}
                    </div>
                  </div>
                ))}
              </div>
              {actions && actions.length > 0 && (
                <div className="mt-3 flex justify-end border-t border-border pt-3">
                  <ActionMenu row={row} actions={actions} />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {filteredData.length > pageSize && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
