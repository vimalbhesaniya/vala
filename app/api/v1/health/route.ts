import { connectDB, isDBConnected } from "@/lib/db/connect";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function GET() {
  try {
    await connectDB();
    return apiSuccess(
      {
        status: "ok",
        database: isDBConnected() ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
      },
      "VALA API is running"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
