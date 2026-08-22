import { connectDB } from "@/lib/db/connect";
import { Coupon } from "@/lib/db/models";
import { serializeCoupon } from "@/lib/db/serializers";
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
    const body = (await request.json()) as { status?: string };

    const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true });
    if (!coupon) return apiError("Coupon not found", 404);

    return apiSuccess(serializeCoupon(coupon), "Coupon updated successfully");
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

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return apiError("Coupon not found", 404);

    return apiSuccess({ id }, "Coupon deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
