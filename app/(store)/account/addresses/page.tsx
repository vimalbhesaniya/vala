"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Modal } from "@/components/common/Modal";
import { useToast } from "@/components/providers/toast-provider";
import { useAuthStore } from "@/store/auth-store";
import { useAddresses, useAddressMutations } from "@/hooks/use-api";
import { cn } from "@/lib/utils/cn";
import type { Address, AddressType } from "@/types/address";

const emptyAddress: Omit<Address, "id" | "userId"> = {
  label: "home",
  name: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  isDefault: false,
};

export default function AddressesPage() {
  const { toast } = useToast();
  const { token } = useAuthStore();
  const isAuth = !!token;
  const { data: addresses = [], isLoading, isError } = useAddresses(isAuth);
  const { create, update, remove } = useAddressMutations();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAddress);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyAddress);
    setModalOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label,
      name: addr.name,
      line1: addr.line1,
      line2: addr.line2 ?? "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      phone: addr.phone,
      isDefault: addr.isDefault,
    });
    setModalOpen(true);
  };

  const saveAddress = async () => {
    try {
      if (editingId) {
        await update.mutateAsync({
          id: editingId,
          body: { ...form, line2: form.line2 || undefined },
        });
        toast("Address updated");
      } else {
        await create.mutateAsync({ ...form, line2: form.line2 || undefined });
        toast("Address added");
      }
      setModalOpen(false);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save address", "error");
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      toast("Address removed");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to remove address", "error");
    }
  };

  const setDefault = async (id: string) => {
    try {
      await update.mutateAsync({ id, body: { isDefault: true } });
      toast("Default address updated");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update default", "error");
    }
  };

  if (!isAuth) {
    return (
      <div>
        <PageHeader title="Addresses" description="Manage your delivery addresses." />
        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <p className="text-sm text-muted">Sign in to manage your addresses.</p>
          <Link href="/account/profile" className="mt-4 inline-block">
            <Button variant="primary" size="sm">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Addresses" description="Manage your delivery addresses.">
        <Button variant="primary" size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-border/40" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-muted">Unable to load addresses.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={cn(
                "rounded-2xl border bg-surface p-5",
                addr.isDefault ? "border-accent/40" : "border-border"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium capitalize text-primary">{addr.label}</p>
                    {addr.isDefault && (
                      <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                        <Star className="h-3 w-3" /> Default
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-foreground">{addr.name}</p>
                  <p className="text-sm text-muted">
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
                  </p>
                  <p className="text-sm text-muted">
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <p className="text-sm text-muted">{addr.phone}</p>
                </div>
                <div className="flex gap-2">
                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefault(addr.id)}
                      className="text-xs text-accent hover:underline"
                    >
                      Set default
                    </button>
                  )}
                  <button type="button" onClick={() => openEdit(addr)} aria-label="Edit">
                    <Pencil className="h-4 w-4 text-muted hover:text-foreground" />
                  </button>
                  <button type="button" onClick={() => deleteAddress(addr.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4 text-muted hover:text-error" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Address" : "Add Address"}>
        <div className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-xs text-muted">Label</label>
            <select
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value as AddressType })}
              className="h-12 w-full rounded-xl border border-border px-4 text-sm"
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>
          {(["name", "line1", "line2", "city", "state", "pincode", "phone"] as const).map((field) => (
            <div key={field}>
              <label className="mb-2 block text-xs capitalize text-muted">{field}</label>
              <Input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </div>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="accent-primary"
            />
            Set as default address
          </label>
          <Button
            variant="primary"
            className="w-full"
            onClick={saveAddress}
            disabled={create.isPending || update.isPending}
          >
            Save Address
          </Button>
        </div>
      </Modal>
    </div>
  );
}
