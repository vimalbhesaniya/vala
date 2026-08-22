import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductListing } from "@/components/product/ProductListing";
import { ProductGridSkeleton } from "@/components/common/Skeleton";
import { serverFetch } from "@/lib/api/server-fetch";
import type { Category } from "@/lib/api/server-fetch";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let category: Category;
  try {
    category = await serverFetch<Category>(`/categories/${slug}`);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: category.name },
        ]}
      />
      <PageHeader
        title={category.name}
        description={`Shop ${category.name.toLowerCase()} from approved school collections.`}
      />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductListing defaultFilters={{ categorySlug: slug }} />
      </Suspense>
    </div>
  );
}
