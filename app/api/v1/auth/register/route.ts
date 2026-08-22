import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models";
import { hashPassword, signToken, toPublicUser } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = registerSchema.parse(await request.json());

    const existing = await User.findOne({ email: body.email });
    if (existing) {
      return apiError("Email already registered", 409);
    }

    const user = await User.create({
      name: body.name,
      email: body.email,
      passwordHash: await hashPassword(body.password),
      phone: body.phone,
      role: "CUSTOMER",
    });

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return apiSuccess(
      { user: toPublicUser(user), token },
      "Account created successfully",
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Validation failed", 422, error.flatten().fieldErrors as Record<string, string[]>);
    }
    return handleApiError(error);
  }
}
