import { connectDB } from "@/lib/db/connect";
import { Coupon } from "@/lib/db/models";
import { serializeCoupon } from "@/lib/db/serializers";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

export async function GET() {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);

    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return apiSuccess(coupons.map(serializeCoupon), "Coupons fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);

    const body = (await request.json()) as {
      code: string;
      description?: string;
      discountType: "percentage" | "fixed";
      discountValue: number;
      minOrder?: number;
      usageLimit?: number;
      expiresAt?: string;
    };

    if (!body.code?.trim() || !body.discountType || !body.discountValue) {
      return apiError("code, discountType, and discountValue are required");
    }

    const coupon = await Coupon.create({
      code: body.code.toUpperCase(),
      description: body.description,
      discountType: body.discountType,
      discountValue: body.discountValue,
      minOrder: body.minOrder ?? 0,
      usageLimit: body.usageLimit ?? 100,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : new Date(Date.now() + 90 * 86400000),
      status: "active",
    });

    return apiSuccess(serializeCoupon(coupon), "Coupon created successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
