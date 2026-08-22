import { Suspense } from "react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductListing } from "@/components/product/ProductListing";
import { ProductGridSkeleton } from "@/components/common/Skeleton";

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      <PageHeader
        title="Shop Uniforms"
        description="Browse our complete collection of premium school uniforms, shoes, and accessories."
      />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductListing />
      </Suspense>
    </div>
  );
}
