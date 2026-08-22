import { z } from "zod";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/db/models";
import { verifyPassword, signToken, toPublicUser } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = loginSchema.parse(await request.json());

    const user = await User.findOne({ email: body.email.toLowerCase() });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return apiError("Invalid email or password", 401);
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return apiSuccess(
      { user: toPublicUser(user), token },
      "Logged in successfully"
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError("Validation failed", 422);
    }
    return handleApiError(error);
  }
}
