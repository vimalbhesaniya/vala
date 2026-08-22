"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: "left" | "right" | "bottom";
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  className,
}: DrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const sideClasses = {
    right: "inset-y-0 right-0 h-full w-full max-w-md animate-slide-in-right",
    left: "inset-y-0 left-0 h-full w-full max-w-md",
    bottom: "inset-x-0 bottom-0 max-h-[90vh] rounded-t-3xl",
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        className="absolute inset-0 bg-primary/30 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close drawer"
      />
      <div
        className={cn(
          "absolute flex h-full flex-col bg-surface shadow-elevated",
          sideClasses[side],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {title && (
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
            <h2 className="text-base font-medium tracking-wide text-primary uppercase">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-primary/5"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
