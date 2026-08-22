import { connectDB } from "@/lib/db/connect";
import { Banner } from "@/lib/db/models";
import { serializeBanner } from "@/lib/db/serializers";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const placement = searchParams.get("placement");

    const now = new Date();
    const filter: Record<string, unknown> = { status: "active" };
    if (placement) filter.placement = placement;

    const banners = await Banner.find(filter).sort({ startsAt: -1 });
    const active = banners.filter((banner) => {
      if (banner.startsAt > now) return false;
      if (banner.endsAt && banner.endsAt < now) return false;
      return true;
    });

    return apiSuccess(
      active.map(serializeBanner),
      "Banners fetched successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
