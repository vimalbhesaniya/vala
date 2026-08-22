import { connectDB } from "@/lib/db/connect";
import { Banner } from "@/lib/db/models";
import { serializeBanner } from "@/lib/db/serializers";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/response";
import type { BannerStatus } from "@/types/banner";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;
    const body = (await request.json()) as Partial<{
      title: string;
      subtitle: string;
      cta: string;
      href: string;
      status: BannerStatus;
      image: string;
      startsAt: string;
      endsAt: string;
    }>;

    const banner = await Banner.findById(id);
    if (!banner) return apiError("Banner not found", 404);

    if (body.title !== undefined) banner.title = body.title;
    if (body.subtitle !== undefined) banner.subtitle = body.subtitle;
    if (body.cta !== undefined) banner.cta = body.cta;
    if (body.href !== undefined) banner.href = body.href;
    if (body.status !== undefined) banner.status = body.status;
    if (body.image !== undefined) banner.image = body.image;
    if (body.startsAt !== undefined) banner.startsAt = new Date(body.startsAt);
    if (body.endsAt !== undefined) banner.endsAt = body.endsAt ? new Date(body.endsAt) : undefined;

    await banner.save();
    return apiSuccess(serializeBanner(banner), "Banner updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    const { id } = await params;

    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) return apiError("Banner not found", 404);

    return apiSuccess({ id }, "Banner deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
