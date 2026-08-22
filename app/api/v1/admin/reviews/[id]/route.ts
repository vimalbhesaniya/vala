import { connectDB } from "@/lib/db/connect";
import { Review, Product } from "@/lib/db/models";
import { serializeReview } from "@/lib/db/serializers";
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
    const body = (await request.json()) as { status?: "approved" | "pending" | "hidden" };

    const review = await Review.findByIdAndUpdate(id, body, { new: true }).populate({
      path: "productId",
      select: "name",
      populate: { path: "schoolId", select: "name" },
    });

    if (!review) return apiError("Review not found", 404);

    const product = review.productId as unknown as {
      name?: string;
      schoolId?: { name?: string };
    } | null;

    return apiSuccess(
      serializeReview(review, {
        name: product?.name ?? "",
        schoolName: product?.schoolId?.name ?? "",
      }),
      "Review updated successfully"
    );
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

    const review = await Review.findByIdAndDelete(id);
    if (!review) return apiError("Review not found", 404);

    return apiSuccess({ id }, "Review deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
