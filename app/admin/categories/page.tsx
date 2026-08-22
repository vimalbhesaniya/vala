"use client";

import { useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AdminAgGrid } from "@/components/admin/AdminAgGrid";
import { AdminGridPage } from "@/components/admin/AdminGridPage";
import { createActionsCellRenderer, type GridAction } from "@/components/admin/AgGridActionsCell";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { Input } from "@/components/common/Input";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAdminCategories, useAdminMutations } from "@/hooks/use-api";
import { useAdminBulkHandler } from "@/hooks/use-admin-bulk";
import { CATEGORY_BULK_ACTIONS } from "@/lib/admin/bulk";
import { useToast } from "@/components/providers/toast-provider";
import type { Category } from "@/types/category";

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const { data: categories = [], isLoading } = useAdminCategories();
  const { createCategory, updateCategory, deleteCategory } = useAdminMutations();
  const { handleBulkAction, bulkLoading } = useAdminBulkHandler("categories");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [name, setName] = useState("");

  const gridActions = useMemo<GridAction<Category>[]>(
    () => [
      {
        label: "Edit",
        onClick: (cat) => {
          setEditing(cat);
          setName(cat.name);
          setModalOpen(true);
        },
      },
      {
        label: "Delete",
        variant: "danger",
        onClick: (row) => setDeleteTarget(row),
      },
    ],
    []
  );

  const columnDefs = useMemo<ColDef<Category>[]>(
    () => [
      { field: "name", headerName: "Name", filter: "agTextColumnFilter", minWidth: 180 },
      { field: "slug", headerName: "Slug", filter: "agTextColumnFilter" },
      { field: "productCount", headerName: "Products", filter: "agNumberColumnFilter", maxWidth: 120 },
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

  const openAdd = () => {
    setEditing(null);
    setName("");
    setModalOpen(true);
  };

  const save = () => {
    if (!name.trim()) return;

    if (editing) {
      updateCategory.mutate(
        { id: editing.id, body: { name: name.trim() } },
        {
          onSuccess: () => {
            toast("Category updated");
            setModalOpen(false);
          },
          onError: (err) => toast(err.message, "error"),
        }
      );
    } else {
      createCategory.mutate(
        { name: name.trim() },
        {
          onSuccess: () => {
            toast("Category created");
            setModalOpen(false);
          },
          onError: (err) => toast(err.message, "error"),
        }
      );
    }
  };

  if (isLoading) {
    return <div className="min-h-0 flex-1 animate-pulse rounded-2xl bg-border/40" />;
  }

  return (
    <AdminGridPage
      toolbar={
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={openAdd}>
            Add Category
          </Button>
        </div>
      }
    >
      <AdminAgGrid<Category>
        rowData={categories}
        columnDefs={columnDefs}
        getRowId={(row) => row.id}
        quickFilterPlaceholder="Search categories..."
        selectable
        bulkActions={CATEGORY_BULK_ACTIONS}
        onBulkAction={handleBulkAction}
        bulkLoading={bulkLoading}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "Add Category"}>
        <div className="space-y-4 p-6">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={save} disabled={createCategory.isPending || updateCategory.isPending}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteCategory.mutate(deleteTarget.id, {
              onSuccess: () => toast("Category deleted"),
              onError: (err) => toast(err.message, "error"),
            });
          }
          setDeleteTarget(null);
        }}
        title="Delete category?"
        description={`Remove "${deleteTarget?.name}"? Categories with products cannot be deleted.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </AdminGridPage>
  );
}
