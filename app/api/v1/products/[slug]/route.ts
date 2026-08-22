import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/db/models";
import { serializeProduct } from "@/lib/db/serializers";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const product = await Product.findOne({ slug, status: "active" })
      .populate("schoolId", "name slug city state logo")
      .populate("categoryId", "name slug");

    if (!product) return apiError("Product not found", 404);

    return apiSuccess(serializeProduct(product), "Product fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
