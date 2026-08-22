import { connectDB } from "@/lib/db/connect";
import { Coupon } from "@/lib/db/models";
import { serializeCoupon } from "@/lib/db/serializers";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.toUpperCase();
    const orderTotal = Number(searchParams.get("total") ?? 0);

    if (!code) return apiError("Coupon code is required", 400);

    const coupon = await Coupon.findOne({ code, status: "active" });
    if (!coupon) return apiError("Invalid coupon code", 404);

    if (coupon.expiresAt < new Date()) {
      return apiError("Coupon has expired", 400);
    }

    if (orderTotal < coupon.minOrder) {
      return apiError(`Minimum order value is ₹${coupon.minOrder}`, 400);
    }

    if (coupon.usageCount >= coupon.usageLimit) {
      return apiError("Coupon usage limit reached", 400);
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = Math.round((orderTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }

    return apiSuccess(
      { ...serializeCoupon(coupon), discountAmount: discount },
      "Coupon is valid"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
