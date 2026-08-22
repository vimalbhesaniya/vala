import { connectDB } from "@/lib/db/connect";
import { Banner } from "@/lib/db/models";
import { serializeBanner } from "@/lib/db/serializers";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";
import type { BannerPlacement, BannerStatus } from "@/types/banner";

export async function GET() {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    const banners = await Banner.find().sort({ placement: 1, startsAt: -1 });
    return apiSuccess(banners.map(serializeBanner), "Banners fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    const body = (await request.json()) as {
      title: string;
      subtitle?: string;
      cta?: string;
      href?: string;
      placement: BannerPlacement;
      status?: BannerStatus;
      image?: string;
      startsAt?: string;
      endsAt?: string;
    };

    if (!body.title?.trim() || !body.placement) {
      return apiError("title and placement are required");
    }

    const banner = await Banner.create({
      title: body.title.trim(),
      subtitle: body.subtitle ?? "",
      cta: body.cta ?? "Shop Now",
      href: body.href ?? "/shop",
      placement: body.placement,
      status: body.status ?? "draft",
      image: body.image,
      startsAt: body.startsAt ? new Date(body.startsAt) : new Date(),
      endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
    });

    return apiSuccess(serializeBanner(banner), "Banner created successfully", 201);
  } catch (error) {
    return handleApiError(error);
  }
}
