import { getSiteSettingsDocument } from "@/lib/db/site-settings";
import { serializeSiteSettings } from "@/lib/db/serializers";
import { requireAuth } from "@/lib/api/auth";
import { apiSuccess, handleApiError } from "@/lib/api/response";
import type { SiteSettings } from "@/types/site-settings";

export async function GET() {
  try {
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    const doc = await getSiteSettingsDocument();
    return apiSuccess(serializeSiteSettings(doc), "Settings fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAuth(["ADMIN", "SUPER_ADMIN"]);
    const body = (await request.json()) as Partial<SiteSettings>;
    const doc = await getSiteSettingsDocument();

    if (body.store) doc.store = { ...doc.store, ...body.store };
    if (body.shipping) doc.shipping = { ...doc.shipping, ...body.shipping };
    if (body.payments) doc.payments = { ...doc.payments, ...body.payments };
    if (body.tax) doc.tax = { ...doc.tax, ...body.tax };

    await doc.save();
    return apiSuccess(serializeSiteSettings(doc), "Settings updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
