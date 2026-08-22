import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/db/models";
import { serializeCategory } from "@/lib/db/serializers";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const category = await Category.findOne({ slug, status: "active" });

    if (!category) return apiError("Category not found", 404);

    return apiSuccess(serializeCategory(category), "Category fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
