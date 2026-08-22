import { connectDB } from "@/lib/db/connect";
import { School } from "@/lib/db/models";
import { serializeSchool } from "@/lib/db/serializers";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const q = searchParams.get("q");

    const filter: Record<string, unknown> = { status: "active" };
    if (city) filter.city = new RegExp(city, "i");
    if (state) filter.state = new RegExp(state, "i");
    if (q) filter.name = new RegExp(q, "i");

    const schools = await School.find(filter).sort({ name: 1 }).lean();
    return apiSuccess(
      schools.map((s) => serializeSchool(s as never)),
      "Schools fetched successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
