import { connectDB } from "@/lib/db/connect";
import { School } from "@/lib/db/models";
import { serializeSchool } from "@/lib/db/serializers";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const school = await School.findOne({ slug, status: "active" });

    if (!school) return apiError("School not found", 404);

    return apiSuccess(serializeSchool(school), "School fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
