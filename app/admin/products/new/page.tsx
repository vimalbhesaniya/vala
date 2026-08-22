"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { AdminScrollPage } from "@/components/admin/AdminGridPage";

export default function AdminNewProductPage() {
  return (
    <AdminScrollPage>
    <div>
      <PageHeader
        title="Create Product"
        description="Add a new product to the catalog"
      />
      <ProductForm mode="create" submitLabel="Create Product" />
    </div>
    </AdminScrollPage>
  );
}
