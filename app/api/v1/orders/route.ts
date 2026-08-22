import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/db/models";
import { serializeOrder } from "@/lib/db/serializers";
import { getAuthUser } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

const orderItemSchema = z.object({
  productId: z.string(),
  productSlug: z.string(),
  name: z.string(),
  image: z.string(),
  schoolName: z.string(),
  size: z.string(),
  sku: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
});

const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  items: z.array(orderItemSchema).min(1),
  paymentMethod: z.enum(["cod", "mock_online"]),
  deliveryMethod: z.enum(["standard", "express"]).default("standard"),
  subtotal: z.number(),
  discount: z.number().default(0),
  shipping: z.number(),
  tax: z.number(),
  total: z.number(),
  address: z.object({
    name: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    phone: z.string(),
  }),
});

function generateOrderNumber() {
  return `VALA-${Date.now().toString().slice(-8)}`;
}

export async function GET() {
  try {
    await connectDB();
    const auth = await getAuthUser();

    const filter = auth ? { $or: [{ userId: auth.userId }, { customerEmail: auth.email }] } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(50);

    return apiSuccess(
      orders.map(serializeOrder),
      "Orders fetched successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const auth = await getAuthUser();
    const body = createOrderSchema.parse(await request.json());

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: auth?.userId,
      ...body,
      paymentStatus: body.paymentMethod === "mock_online" ? "paid" : "pending",
      status: "confirmed",
      estimatedDelivery: body.deliveryMethod === "express" ? "2–3 business days" : "5–7 business days",
    });

    return apiSuccess(serializeOrder(order), "Order placed successfully", 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Validation failed", 422);
    }
    return handleApiError(error);
  }
}
