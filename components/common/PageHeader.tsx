import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, className, children }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 sm:mb-10", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-medium tracking-tight text-primary sm:text-[36px]">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-muted sm:text-base">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
