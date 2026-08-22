import { seedDatabase } from "@/lib/db/seed";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";

export async function POST() {
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_SEED) {
    return apiError("Seeding is disabled in production", 403);
  }

  try {
    const counts = await seedDatabase();
    return apiSuccess(counts, "Database seeded successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
