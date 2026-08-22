"use client";

import {
  useState,
  useRef,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";

interface TooltipProps {
  content: string;
  subtitle?: string;
  side?: "right" | "left";
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function Tooltip({
  content,
  subtitle,
  side = "right",
  disabled = false,
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({});
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const gap = 10;

    if (side === "right") {
      setStyle({
        position: "fixed",
        top: rect.top + rect.height / 2,
        left: rect.right + gap,
        transform: "translateY(-50%)",
        zIndex: 200,
      });
    } else {
      setStyle({
        position: "fixed",
        top: rect.top + rect.height / 2,
        left: rect.left - gap,
        transform: "translate(-100%, -50%)",
        zIndex: 200,
      });
    }
  }, [side]);

  const show = () => {
    if (disabled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updatePosition();
      setVisible(true);
    }, 120);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <>
      <span
        ref={triggerRef}
        className={cn("block", className)}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>

      {visible &&
        typeof document !== "undefined" &&
        createPortal(
          <div style={style} role="tooltip">
            <div className="pointer-events-none animate-tooltip-in">
              <div className="relative whitespace-nowrap rounded-xl bg-primary px-3 py-2 shadow-elevated ring-1 ring-white/10">
                <p className="text-xs font-semibold tracking-wide text-white">{content}</p>
                {subtitle && (
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-accent/90">
                    {subtitle}
                  </p>
                )}
                <span
                  className={cn(
                    "absolute top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-primary ring-1 ring-white/10",
                    side === "right" ? "-left-1" : "-right-1"
                  )}
                  aria-hidden
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
