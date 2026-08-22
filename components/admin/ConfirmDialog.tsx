"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { cn } from "@/lib/utils/cn";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-md">
      <div className="p-6">
        <div className="flex gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              variant === "danger" ? "bg-error/10 text-error" : "bg-accent/10 text-accent"
            )}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-primary">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "primary" : "secondary"}
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className={variant === "danger" ? "bg-error hover:bg-error/90" : undefined}
          >
            {loading ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
