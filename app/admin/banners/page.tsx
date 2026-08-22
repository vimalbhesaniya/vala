"use client";

import { useMemo, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { Plus } from "lucide-react";
import { AdminAgGrid } from "@/components/admin/AdminAgGrid";
import { AdminGridPage } from "@/components/admin/AdminGridPage";
import { createActionsCellRenderer, type GridAction } from "@/components/admin/AgGridActionsCell";
import { createStatusCellRenderer } from "@/components/admin/AgGridStatusCell";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { useAdminBanners, useAdminMutations } from "@/hooks/use-api";
import { useAdminBulkHandler } from "@/hooks/use-admin-bulk";
import { BANNER_BULK_ACTIONS } from "@/lib/admin/bulk";
import type { Banner } from "@/types/banner";
import { useToast } from "@/components/providers/toast-provider";

const PLACEMENT_LABELS: Record<Banner["placement"], string> = {
  homepage_hero: "Homepage Hero",
  homepage_mid: "Homepage Mid",
  announcement: "Announcement Bar",
};

const BANNER_STATUS_CONFIG = [
  { value: "active", label: "Active", variant: "success" as const },
  { value: "draft", label: "Draft", variant: "default" as const },
  { value: "scheduled", label: "Scheduled", variant: "accent" as const },
];

const emptyForm = {
  title: "",
  subtitle: "",
  cta: "Shop Now",
  href: "/shop",
  placement: "homepage_hero" as Banner["placement"],
  status: "draft" as Banner["status"],
  image: "",
};

export default function AdminBannersPage() {
  const { toast } = useToast();
  const { data: banners = [], isLoading } = useAdminBanners();
  const { createBanner, updateBanner, deleteBanner } = useAdminMutations();
  const { handleBulkAction, bulkLoading } = useAdminBulkHandler("banners");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditing(banner);
    setForm({
      title: banner.title,
      subtitle: banner.subtitle,
      cta: banner.cta,
      href: banner.href,
      placement: banner.placement,
      status: banner.status,
      image: banner.image ?? "",
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;

    const body = {
      title: form.title.trim(),
      subtitle: form.subtitle,
      cta: form.cta,
      href: form.href,
      placement: form.placement,
      status: form.status,
      image: form.image || undefined,
    };

    if (editing) {
      updateBanner.mutate(
        { id: editing.id, body },
        {
          onSuccess: () => {
            toast("Banner updated");
            setModalOpen(false);
          },
          onError: (err) => toast(err.message, "error"),
        }
      );
    } else {
      createBanner.mutate(body, {
        onSuccess: () => {
          toast("Banner created");
          setModalOpen(false);
        },
        onError: (err) => toast(err.message, "error"),
      });
    }
  };

  const gridActions = useMemo<GridAction<Banner>[]>(
    () => [
      { label: "Edit", onClick: openEdit },
      {
        label: "Activate",
        onClick: (row) => {
          updateBanner.mutate(
            { id: row.id, body: { status: "active" } },
            { onSuccess: () => toast(`Banner "${row.title}" activated`) }
          );
        },
      },
      { label: "Delete", variant: "danger", onClick: (row) => setDeleteTarget(row) },
    ],
    [updateBanner, toast]
  );

  const columnDefs = useMemo<ColDef<Banner>[]>(
    () => [
      { field: "title", headerName: "Title", filter: "agTextColumnFilter", minWidth: 180 },
      { field: "subtitle", headerName: "Subtitle", filter: "agTextColumnFilter" },
      {
        field: "placement",
        headerName: "Placement",
        filter: "agSetColumnFilter",
        valueFormatter: (p) => PLACEMENT_LABELS[p.value as Banner["placement"]] ?? String(p.value),
        filterParams: { values: Object.keys(PLACEMENT_LABELS) },
      },
      { field: "cta", headerName: "CTA", filter: "agTextColumnFilter", maxWidth: 120 },
      { field: "href", headerName: "Link", filter: "agTextColumnFilter" },
      {
        field: "status",
        headerName: "Status",
        filter: "agSetColumnFilter",
        filterParams: { values: ["active", "draft", "scheduled"] },
        cellRenderer: createStatusCellRenderer(BANNER_STATUS_CONFIG),
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
        <div className="flex justify-end">
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Banner
          </Button>
        </div>
      }
    >
      <AdminAgGrid<Banner>
        rowData={banners}
        columnDefs={columnDefs}
        getRowId={(row) => row.id}
        quickFilterPlaceholder="Search banners..."
        selectable
        bulkActions={BANNER_BULK_ACTIONS}
        onBulkAction={handleBulkAction}
        bulkLoading={bulkLoading}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Banner" : "Add Banner"}>
        <div className="space-y-4 p-6">
          <Field label="Title">
            <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          </Field>
          <Field label="Subtitle">
            <Input value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))} />
          </Field>
          <Field label="Hero Image URL (optional)">
            <Input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} placeholder="https://..." />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="CTA Text">
              <Input value={form.cta} onChange={(e) => setForm((p) => ({ ...p, cta: e.target.value }))} />
            </Field>
            <Field label="Link">
              <Input value={form.href} onChange={(e) => setForm((p) => ({ ...p, href: e.target.value }))} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Placement">
              <select
                value={form.placement}
                onChange={(e) => setForm((p) => ({ ...p, placement: e.target.value as Banner["placement"] }))}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              >
                {Object.entries(PLACEMENT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as Banner["status"] }))}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </Field>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} disabled={createBanner.isPending || updateBanner.isPending}>
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
            deleteBanner.mutate(deleteTarget.id, {
              onSuccess: () => toast("Banner deleted"),
            });
          }
          setDeleteTarget(null);
        }}
        title="Delete banner?"
        description={`Remove "${deleteTarget?.title}"? This will update the storefront immediately.`}
        confirmLabel="Delete"
        variant="danger"
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
