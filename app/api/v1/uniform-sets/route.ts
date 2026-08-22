import { connectDB } from "@/lib/db/connect";
import { UniformSet, School } from "@/lib/db/models";
import { serializeUniformSet } from "@/lib/db/serializers";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const schoolSlug = searchParams.get("school");

    const filter: Record<string, unknown> = { status: "active" };

    if (schoolSlug) {
      const school = await School.findOne({ slug: schoolSlug });
      if (school) filter.schoolId = school._id;
    }

    const sets = await UniformSet.find(filter)
      .populate("schoolId", "name slug")
      .sort({ createdAt: -1 });

    return apiSuccess(
      sets.map((s) => {
        const school = s.schoolId as unknown as { name?: string } | null;
        return serializeUniformSet(s, school ? { name: school.name } as never : undefined);
      }),
      "Uniform sets fetched successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
