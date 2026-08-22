import { Suspense } from "react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { SearchContent } from "./search-content";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
          <ProductGridSkeleton count={4} />
        </div>
      }
    >
      <SearchContent key={q} initialQuery={q} />
    </Suspense>
  );
}
