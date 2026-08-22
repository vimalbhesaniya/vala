import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/db/models";
import { serializeOrder } from "@/lib/db/serializers";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = (await request.json()) as {
      orderNumber?: string;
      email?: string;
    };

    if (!body.orderNumber || !body.email) {
      return apiError("Order number and email are required", 400);
    }

    const order = await Order.findOne({
      orderNumber: body.orderNumber.toUpperCase(),
      customerEmail: body.email.toLowerCase(),
    });

    if (!order) return apiError("Order not found", 404);

    return apiSuccess(serializeOrder(order), "Order found");
  } catch (error) {
    return handleApiError(error);
  }
}
