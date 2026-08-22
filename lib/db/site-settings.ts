import { connectDB } from "@/lib/db/connect";
import { SiteSettingsModel } from "@/lib/db/models/SiteSettings";
import { DEFAULT_SITE_SETTINGS } from "@/lib/constants/default-site-config";
import type { SiteSettings } from "@/types/site-settings";

export async function getSiteSettingsDocument() {
  await connectDB();
  let doc = await SiteSettingsModel.findOne({ key: "default" });
  if (!doc) {
    doc = await SiteSettingsModel.create({ key: "default", ...DEFAULT_SITE_SETTINGS });
  }
  return doc;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const doc = await getSiteSettingsDocument();
  return {
    store: doc.store,
    shipping: doc.shipping,
    payments: doc.payments,
    tax: doc.tax,
  };
}
