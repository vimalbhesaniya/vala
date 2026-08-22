import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/db/models";
import { serializeOrder } from "@/lib/db/serializers";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function GET() {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);

    const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
    return apiSuccess(
      orders.map(serializeOrder),
      "Admin orders fetched successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
