import { connectDB } from "@/lib/db/connect";
import { Category, Product } from "@/lib/db/models";
import { serializeCategory } from "@/lib/db/serializers";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const body = (await request.json()) as Partial<{
      name: string;
      slug: string;
      image: string;
      description: string;
      sortOrder: number;
      status: "active" | "inactive";
    }>;

    const category = await Category.findById(id);
    if (!category) return apiError("Category not found", 404);

    if (body.name !== undefined) category.name = body.name;
    if (body.slug !== undefined) category.slug = body.slug.toLowerCase();
    if (body.image !== undefined) category.image = body.image;
    if (body.description !== undefined) category.description = body.description;
    if (body.sortOrder !== undefined) category.sortOrder = body.sortOrder;
    if (body.status !== undefined) category.status = body.status;

    await category.save();
    return apiSuccess(serializeCategory(category), "Category updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;

    const productCount = await Product.countDocuments({ categoryId: id });
    if (productCount > 0) {
      return apiError("Cannot delete category with assigned products", 400);
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) return apiError("Category not found", 404);

    return apiSuccess({ id }, "Category deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
