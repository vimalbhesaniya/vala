import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { Address, serializeAddress } from "@/lib/db/models/Address";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

const addressSchema = z.object({
  label: z.enum(["home", "work", "other"]).default("home"),
  name: z.string().min(2),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(5),
  phone: z.string().min(10),
  isDefault: z.boolean().optional(),
});

export async function GET() {
  try {
    await connectDB();
    const auth = await requireAuth();
    const addresses = await Address.find({ userId: auth.userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });
    return apiSuccess(
      addresses.map(serializeAddress),
      "Addresses fetched successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const auth = await requireAuth();
    const body = addressSchema.parse(await request.json());

    if (body.isDefault) {
      await Address.updateMany({ userId: auth.userId }, { isDefault: false });
    }

    const count = await Address.countDocuments({ userId: auth.userId });
    const address = await Address.create({
      userId: auth.userId,
      ...body,
      isDefault: body.isDefault ?? count === 0,
    });

    return apiSuccess(serializeAddress(address), "Address created successfully", 201);
  } catch (error) {
    if (error instanceof z.ZodError) return apiError("Validation failed", 422);
    return handleApiError(error);
  }
}
