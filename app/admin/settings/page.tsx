"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { AdminScrollPage } from "@/components/admin/AdminGridPage";
import { useToast } from "@/components/providers/toast-provider";
import { useAdminSettings, useAdminMutations } from "@/hooks/use-api";
import type { SiteSettings } from "@/types/site-settings";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useAdminSettings();
  const { updateSettings } = useAdminMutations();
  const [form, setForm] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleSave = () => {
    if (!form) return;
    updateSettings.mutate(form, {
      onSuccess: () => toast("Settings saved — storefront will update on refresh"),
      onError: (err) => toast(err.message, "error"),
    });
  };

  if (isLoading || !form) {
    return <div className="h-64 animate-pulse rounded-2xl bg-border/40" />;
  }

  return (
    <AdminScrollPage>
    <div className="space-y-8">
      <SettingsSection title="Store Information" description="Basic store details visible to customers">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Store Name">
            <Input
              value={form.store.name}
              onChange={(e) =>
                setForm((prev) =>
                  prev ? { ...prev, store: { ...prev.store, name: e.target.value } } : prev
                )
              }
            />
          </Field>
          <Field label="Support Email">
            <Input
              type="email"
              value={form.store.email}
              onChange={(e) =>
                setForm((prev) =>
                  prev ? { ...prev, store: { ...prev.store, email: e.target.value } } : prev
                )
              }
            />
          </Field>
          <Field label="Phone">
            <Input
              value={form.store.phone}
              onChange={(e) =>
                setForm((prev) =>
                  prev ? { ...prev, store: { ...prev.store, phone: e.target.value } } : prev
                )
              }
            />
          </Field>
          <Field label="Business Address">
            <Input
              value={form.store.address}
              onChange={(e) =>
                setForm((prev) =>
                  prev ? { ...prev, store: { ...prev.store, address: e.target.value } } : prev
                )
              }
            />
          </Field>
        </div>
      </SettingsSection>

      <SettingsSection title="Shipping" description="Delivery rates and free shipping rules">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Free Shipping Threshold (INR)">
            <Input
              type="number"
              value={form.shipping.freeThreshold}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        shipping: { ...prev.shipping, freeThreshold: Number(e.target.value) },
                      }
                    : prev
                )
              }
            />
          </Field>
          <Field label="Processing Days">
            <Input
              type="number"
              value={form.shipping.processingDays}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        shipping: { ...prev.shipping, processingDays: Number(e.target.value) },
                      }
                    : prev
                )
              }
            />
          </Field>
          <Field label="Standard Shipping Rate (INR)">
            <Input
              type="number"
              value={form.shipping.standardRate}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        shipping: { ...prev.shipping, standardRate: Number(e.target.value) },
                      }
                    : prev
                )
              }
            />
          </Field>
          <Field label="Express Shipping Rate (INR)">
            <Input
              type="number"
              value={form.shipping.expressRate}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? {
                        ...prev,
                        shipping: { ...prev.shipping, expressRate: Number(e.target.value) },
                      }
                    : prev
                )
              }
            />
          </Field>
        </div>
      </SettingsSection>

      <SettingsSection title="Payments" description="Payment methods and gateway configuration">
        <div className="space-y-4">
          <Toggle
            label="Cash on Delivery (COD)"
            checked={form.payments.codEnabled}
            onChange={(checked) =>
              setForm((prev) =>
                prev
                  ? { ...prev, payments: { ...prev.payments, codEnabled: checked } }
                  : prev
              )
            }
          />
          <Toggle
            label="Online Payments"
            checked={form.payments.onlineEnabled}
            onChange={(checked) =>
              setForm((prev) =>
                prev
                  ? { ...prev, payments: { ...prev.payments, onlineEnabled: checked } }
                  : prev
              )
            }
          />
          <Field label="Razorpay Key (Test)">
            <Input
              value={form.payments.razorpayKey}
              onChange={(e) =>
                setForm((prev) =>
                  prev
                    ? { ...prev, payments: { ...prev.payments, razorpayKey: e.target.value } }
                    : prev
                )
              }
            />
          </Field>
        </div>
      </SettingsSection>

      <SettingsSection title="Tax" description="GST and tax configuration">
        <div className="space-y-4">
          <Toggle
            label="Enable GST"
            checked={form.tax.gstEnabled}
            onChange={(checked) =>
              setForm((prev) =>
                prev ? { ...prev, tax: { ...prev.tax, gstEnabled: checked } } : prev
              )
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="GST Rate (%)">
              <Input
                type="number"
                value={form.tax.gstRate}
                onChange={(e) =>
                  setForm((prev) =>
                    prev
                      ? { ...prev, tax: { ...prev.tax, gstRate: Number(e.target.value) } }
                      : prev
                  )
                }
              />
            </Field>
            <Field label="GST Number">
              <Input
                value={form.tax.gstNumber}
                onChange={(e) =>
                  setForm((prev) =>
                    prev ? { ...prev, tax: { ...prev.tax, gstNumber: e.target.value } } : prev
                  )
                }
              />
            </Field>
          </div>
        </div>
      </SettingsSection>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateSettings.isPending}>
          {updateSettings.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
    </AdminScrollPage>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className="mb-5 border-b border-border pb-4">
        <h2 className="text-sm font-semibold text-primary">{title}</h2>
        <p className="mt-1 text-xs text-muted">{description}</p>
      </div>
      {children}
    </section>
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

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-background/30 px-4 py-3">
      <span className="text-sm font-medium text-primary">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-border"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}
