import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]",
  secondary:
    "bg-accent text-white hover:bg-accent/90 active:scale-[0.98]",
  outline:
    "border border-primary bg-transparent text-primary hover:bg-primary hover:text-white",
  ghost:
    "bg-transparent text-primary hover:bg-primary/5",
};

const sizes = {
  sm: "h-9 px-4 text-xs tracking-wide",
  md: "h-11 px-6 text-sm tracking-wide",
  lg: "h-13 px-8 text-sm tracking-widest uppercase",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
