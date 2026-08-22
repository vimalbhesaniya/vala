import { cn } from "@/lib/utils/cn";

interface AdminGridPageProps {
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
}

/** Full-height admin listing layout — grid fills viewport below header. */
export function AdminGridPage({ children, toolbar, className }: AdminGridPageProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-4", className)}>
      {toolbar ? <div className="shrink-0">{toolbar}</div> : null}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

/** Scrollable admin page for dashboards, forms, and detail views. */
export function AdminScrollPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", className)}>
      {children}
    </div>
  );
}
