"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useSchools, useCategories, useAdminMutations } from "@/hooks/use-api";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils/cn";

const productFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  schoolId: z.string().min(1, "Select a school"),
  categoryId: z.string().min(1, "Select a category"),
  gender: z.enum(["boys", "girls", "unisex"]),
  price: z.number().min(1, "Price must be greater than 0"),
  comparePrice: z.number().min(1, "Compare price must be greater than 0"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  productId?: string;
  defaultValues?: Partial<ProductFormValues>;
  submitLabel?: string;
  mode?: "create" | "edit";
}

export function ProductForm({
  productId,
  defaultValues,
  submitLabel = "Save Product",
  mode = "create",
}: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { data: schools = [] } = useSchools();
  const { data: categories = [] } = useCategories();
  const { createProduct, updateProduct } = useAdminMutations();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      schoolId: schools[0]?.id ?? "",
      categoryId: categories[0]?.id ?? "",
      gender: "unisex",
      price: 699,
      comparePrice: 899,
      ...defaultValues,
    },
  });

  const onSubmit = handleSubmit((values) => {
    if (mode === "create") {
      createProduct.mutate(values, {
        onSuccess: () => {
          toast("Product created successfully");
          router.push("/admin/products");
        },
        onError: (err) => toast(err.message),
      });
    } else if (productId) {
      updateProduct.mutate(
        { id: productId, body: values },
        {
          onSuccess: () => {
            toast("Product updated successfully");
            router.push("/admin/products");
          },
          onError: (err) => toast(err.message),
        }
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-sm font-semibold text-primary">Basic Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Product Name" error={errors.name?.message}>
            <Input {...register("name")} placeholder="Classic White Cotton Shirt" />
          </Field>
          <Field label="URL Slug" error={errors.slug?.message}>
            <Input {...register("slug")} placeholder="classic-white-cotton-shirt" />
          </Field>
          <Field label="Description" error={errors.description?.message} className="sm:col-span-2">
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Product description..."
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-sm font-semibold text-primary">Catalog Details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="School" error={errors.schoolId?.message}>
            <select
              {...register("schoolId")}
              className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm focus:border-primary focus:outline-none"
            >
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category" error={errors.categoryId?.message}>
            <select
              {...register("categoryId")}
              className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm focus:border-primary focus:outline-none"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Gender" error={errors.gender?.message}>
            <select
              {...register("gender")}
              className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-sm focus:border-primary focus:outline-none"
            >
              <option value="boys">Boys</option>
              <option value="girls">Girls</option>
              <option value="unisex">Unisex</option>
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-sm font-semibold text-primary">Pricing</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Price (INR)" error={errors.price?.message}>
            <Input type="number" {...register("price", { valueAsNumber: true })} />
          </Field>
          <Field label="Compare at Price (INR)" error={errors.comparePrice?.message}>
            <Input type="number" {...register("comparePrice", { valueAsNumber: true })} />
          </Field>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href="/admin/products">
          <Button type="button" variant="outline" size="sm">
            Cancel
          </Button>
        </Link>
        <Button type="submit" size="sm" disabled={isSubmitting || createProduct.isPending || updateProduct.isPending}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-xs font-medium uppercase tracking-wider text-muted">{label}</label>
      {children}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
