import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/db/models";
import { serializeOrder } from "@/lib/db/serializers";
import { getAuthUser, requireAuth } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";
import type { OrderStatus } from "@/types/order";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const auth = await getAuthUser();

    const order = await Order.findById(id);
    if (!order) return apiError("Order not found", 404);

    const isOwner =
      auth &&
      (order.userId?.toString() === auth.userId ||
        order.customerEmail === auth.email);
    const isAdmin = auth && ["ADMIN", "SUPER_ADMIN"].includes(auth.role);

    if (!isOwner && !isAdmin) {
      return apiError("Unauthorized", 401);
    }

    return apiSuccess(serializeOrder(order), "Order fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const body = (await request.json()) as { status?: OrderStatus };

    const order = await Order.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    );

    if (!order) return apiError("Order not found", 404);

    return apiSuccess(serializeOrder(order), "Order updated successfully");
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

    const order = await Order.findByIdAndDelete(id);
    if (!order) return apiError("Order not found", 404);

    return apiSuccess({ id }, "Order deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
