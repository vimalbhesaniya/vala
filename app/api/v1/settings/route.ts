import { getSiteSettings } from "@/lib/db/site-settings";
import { apiSuccess, handleApiError } from "@/lib/api/response";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return apiSuccess(settings, "Settings fetched successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
