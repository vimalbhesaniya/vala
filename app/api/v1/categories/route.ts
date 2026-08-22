import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/db/models";
import { serializeCategory } from "@/lib/db/serializers";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ status: "active" })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return apiSuccess(
      categories.map((c) => serializeCategory(c as never)),
      "Categories fetched successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
