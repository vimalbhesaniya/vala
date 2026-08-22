import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PageHeader } from "@/components/common/PageHeader";
import { cn } from "@/lib/utils/cn";

interface ContentPageProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}

export function ContentPage({
  title,
  description,
  breadcrumbs = [{ label: "Home", href: "/" }],
  children,
  className,
  wide = false,
}: ContentPageProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 py-8 sm:px-6 lg:px-8",
        wide ? "max-w-5xl" : "max-w-3xl",
        className
      )}
    >
      <Breadcrumb items={[...breadcrumbs, { label: title }]} />
      <PageHeader title={title} description={description} />
      <div className="space-y-6 text-sm leading-relaxed text-muted [&_h2]:text-base [&_h2]:font-medium [&_h2]:text-primary [&_h3]:text-sm [&_h3]:font-medium [&_h3]:text-foreground [&_p+p]:mt-4 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
