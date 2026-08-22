import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { serverFetch } from "@/lib/api/server-fetch";
import type { Product, Category } from "@/lib/api/server-fetch";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Product;
  try {
    product = await serverFetch<Product>(`/products/${slug}`);
  } catch {
    notFound();
  }

  let category: Category | null = null;
  if (product.categorySlug) {
    try {
      category = await serverFetch<Category>(`/categories/${product.categorySlug}`);
    } catch {
      category = null;
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          ...(category
            ? [{ label: category.name, href: `/categories/${category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />
      <div className="mt-6">
        <ProductDetailClient product={product} />
      </div>
    </div>
  );
}
