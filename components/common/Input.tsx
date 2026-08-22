import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted transition-colors duration-200 focus:border-primary focus:outline-none",
            icon && "pl-11",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
