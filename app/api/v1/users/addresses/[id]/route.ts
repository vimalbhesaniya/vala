import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { Address, serializeAddress } from "@/lib/db/models/Address";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

const updateSchema = z.object({
  label: z.enum(["home", "work", "other"]).optional(),
  name: z.string().min(2).optional(),
  line1: z.string().min(3).optional(),
  line2: z.string().optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  pincode: z.string().min(5).optional(),
  phone: z.string().min(10).optional(),
  isDefault: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const auth = await requireAuth();
    const { id } = await params;
    const body = updateSchema.parse(await request.json());

    if (body.isDefault) {
      await Address.updateMany({ userId: auth.userId }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      body,
      { new: true }
    );

    if (!address) return apiError("Address not found", 404);

    return apiSuccess(serializeAddress(address), "Address updated successfully");
  } catch (error) {
    if (error instanceof z.ZodError) return apiError("Validation failed", 422);
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const auth = await requireAuth();
    const { id } = await params;

    const address = await Address.findOneAndDelete({ _id: id, userId: auth.userId });
    if (!address) return apiError("Address not found", 404);

    return apiSuccess({ id }, "Address deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
