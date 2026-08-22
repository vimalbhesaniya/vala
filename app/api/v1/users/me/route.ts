import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models";
import { requireAuth, toPublicUser } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
});

export async function GET() {
  try {
    await connectDB();
    const auth = await requireAuth();
    const user = await User.findById(auth.userId);

    if (!user) return apiError("User not found", 404);

    return apiSuccess(toPublicUser(user), "Profile fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const auth = await requireAuth();
    const body = updateProfileSchema.parse(await request.json());

    if (body.email && body.email.toLowerCase() !== auth.email) {
      const existing = await User.findOne({
        email: body.email.toLowerCase(),
        _id: { $ne: auth.userId },
      });
      if (existing) {
        return apiError("Email is already in use", 409);
      }
    }

    const user = await User.findByIdAndUpdate(
      auth.userId,
      {
        ...(body.name && { name: body.name }),
        ...(body.email && { email: body.email.toLowerCase() }),
        ...(body.phone && { phone: body.phone }),
      },
      { new: true, runValidators: true }
    );

    if (!user) return apiError("User not found", 404);

    return apiSuccess(toPublicUser(user), "Profile updated successfully");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Validation failed", 422);
    }
    return handleApiError(error);
  }
}
