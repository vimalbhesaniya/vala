import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/db/models";
import { serializeProduct } from "@/lib/db/serializers";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;

    const product = await Product.findById(id)
      .populate("schoolId", "name slug city state logo")
      .populate("categoryId", "name slug");

    if (!product) return apiError("Product not found", 404);

    return apiSuccess(serializeProduct(product), "Product fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const body = (await request.json()) as {
      name?: string;
      slug?: string;
      description?: string;
      schoolId?: string;
      categoryId?: string;
      gender?: "boys" | "girls" | "unisex";
      price?: number;
      comparePrice?: number;
      status?: "active" | "draft" | "archived";
    };

    const product = await Product.findById(id);
    if (!product) return apiError("Product not found", 404);

    if (body.name) product.name = body.name;
    if (body.slug) product.slug = body.slug.toLowerCase();
    if (body.description) product.description = body.description;
    if (body.schoolId) product.schoolId = body.schoolId as never;
    if (body.categoryId) product.categoryId = body.categoryId as never;
    if (body.gender) product.gender = body.gender;
    if (body.status) product.status = body.status;

    if (body.price !== undefined && product.variants[0]) {
      product.variants[0].price = body.price;
      if (body.comparePrice !== undefined) {
        product.variants[0].comparePrice = body.comparePrice;
      }
    }

    await product.save();

    const populated = await Product.findById(product._id)
      .populate("schoolId", "name slug")
      .populate("categoryId", "name slug");

    return apiSuccess(serializeProduct(populated!), "Product updated successfully");
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

    const product = await Product.findByIdAndDelete(id);
    if (!product) return apiError("Product not found", 404);

    return apiSuccess({ id }, "Product deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
