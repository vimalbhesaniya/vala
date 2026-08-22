import { connectDB } from "@/lib/db/connect";
import { Review, Product } from "@/lib/db/models";
import { serializeReview } from "@/lib/db/serializers";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function GET() {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);

    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate({
        path: "productId",
        select: "name",
        populate: { path: "schoolId", select: "name" },
      });

    return apiSuccess(
      reviews.map((r) => {
        const product = r.productId as unknown as {
          name?: string;
          schoolId?: { name?: string };
        } | null;
        return serializeReview(r, {
          name: product?.name ?? "",
          schoolName: product?.schoolId?.name ?? "",
        });
      }),
      "Reviews fetched successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
