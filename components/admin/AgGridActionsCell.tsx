"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";
import type { CustomCellRendererProps } from "ag-grid-react";
import { cn } from "@/lib/utils/cn";

export interface GridAction<T> {
  label: string;
  onClick: (row: T) => void;
  variant?: "default" | "danger";
}

export interface AgGridActionsCellProps<T>
  extends CustomCellRendererProps<T, unknown, { actions?: GridAction<T>[] }> {
  actions?: GridAction<T>[];
}

export function AgGridActionsCell<T>({
  data,
  actions: paramActions,
  context,
}: AgGridActionsCellProps<T>) {
  const actions = paramActions ?? context?.actions ?? [];
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updateMenuPos = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 4,
      left: Math.max(8, rect.right - 148),
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    updateMenuPos();

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) return;
      const menu = document.getElementById("ag-grid-actions-menu");
      if (menu?.contains(target)) return;
      setOpen(false);
    }

    function handleDismiss() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleDismiss, true);
    window.addEventListener("resize", handleDismiss);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleDismiss, true);
      window.removeEventListener("resize", handleDismiss);
    };
  }, [open, updateMenuPos]);

  if (!data || actions.length === 0) return null;

  return (
    <>
      <div className="flex h-full w-full items-center justify-end">
        <button
          ref={buttonRef}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            if (!open) updateMenuPos();
            setOpen((prev) => !prev);
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary/5 hover:text-primary"
          aria-label="Row actions"
          aria-expanded={open}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id="ag-grid-actions-menu"
            style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
            className="min-w-[148px] rounded-xl border border-border bg-surface py-1 shadow-elevated"
          >
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  action.onClick(data);
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
          </div>,
          document.body
        )}
    </>
  );
}

/** Bind row actions directly — more reliable than grid `context` in AG Grid v33. */
export function createActionsCellRenderer<T>(actions: GridAction<T>[]) {
  return function ActionsCellRenderer(props: CustomCellRendererProps<T>) {
    return <AgGridActionsCell {...props} actions={actions} />;
  };
}
