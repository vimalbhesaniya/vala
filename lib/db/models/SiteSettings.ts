import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { SiteSettings } from "@/types/site-settings";

export interface ISiteSettings extends Document, SiteSettings {
  key: string;
  updatedAt: Date;
  createdAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    store: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
    },
    shipping: {
      freeThreshold: { type: Number, required: true },
      standardRate: { type: Number, required: true },
      expressRate: { type: Number, required: true },
      processingDays: { type: Number, required: true },
    },
    payments: {
      codEnabled: { type: Boolean, default: true },
      onlineEnabled: { type: Boolean, default: true },
      razorpayKey: { type: String, default: "" },
    },
    tax: {
      gstEnabled: { type: Boolean, default: true },
      gstRate: { type: Number, default: 5 },
      gstNumber: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const SiteSettingsModel: Model<ISiteSettings> =
  mongoose.models.SiteSettings ??
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
