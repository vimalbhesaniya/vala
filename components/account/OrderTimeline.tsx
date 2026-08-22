import { ORDER_TIMELINE_STEPS, ORDER_STATUS_LABELS, type OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

const STATUS_ORDER: OrderStatus[] = [
  "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered",
];

export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled" || status === "returned") {
    return (
      <p className="text-sm font-medium text-error">
        Order {ORDER_STATUS_LABELS[status]}
      </p>
    );
  }

  const currentIdx = STATUS_ORDER.indexOf(status === "pending" ? "confirmed" : status);

  return (
    <ol className="relative space-y-0">
      {ORDER_TIMELINE_STEPS.map((step, i) => {
        const stepIdx = STATUS_ORDER.indexOf(step);
        const done = stepIdx <= currentIdx;
        const active = stepIdx === currentIdx;
        return (
          <li key={step} className="flex gap-4 pb-8 last:pb-0">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  done ? "border-success bg-success text-white" : "border-border bg-surface",
                  active && "ring-4 ring-success/20"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-border" />}
              </div>
              {i < ORDER_TIMELINE_STEPS.length - 1 && (
                <div className={cn("w-0.5 flex-1 min-h-[2rem]", done ? "bg-success" : "bg-border")} />
              )}
            </div>
            <div className="pt-1">
              <p className={cn("text-sm font-medium", done ? "text-foreground" : "text-muted")}>
                {ORDER_STATUS_LABELS[step]}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
