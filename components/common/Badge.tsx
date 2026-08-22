import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "sale" | "new";
  className?: string;
}

const variants = {
  default: "bg-primary/5 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  sale: "bg-error/10 text-error",
  new: "bg-primary text-white",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
