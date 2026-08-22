"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminScrollPage } from "@/components/admin/AdminGridPage";
import { useAdminProduct } from "@/hooks/use-api";
import { getProductPrice } from "@/types/product";

export default function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: product, isLoading } = useAdminProduct(id);

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-border/40" />;
  }

  if (!product) notFound();

  const { price, comparePrice } = getProductPrice(product);

  return (
    <AdminScrollPage>
    <div>
      <PageHeader title="Edit Product" description={product.name} />
      <ProductForm
        mode="edit"
        productId={product.id}
        submitLabel="Save Changes"
        defaultValues={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          schoolId: product.schoolId,
          categoryId: product.categoryId,
          gender: product.gender,
          price,
          comparePrice,
        }}
      />
    </div>
    </AdminScrollPage>
  );
}
