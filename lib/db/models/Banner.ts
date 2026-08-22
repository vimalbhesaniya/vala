import mongoose, { Schema, type Document, type Model } from "mongoose";
import type { BannerPlacement, BannerStatus } from "@/types/banner";

export interface IBanner extends Document {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  placement: BannerPlacement;
  status: BannerStatus;
  image?: string;
  startsAt: Date;
  endsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    cta: { type: String, default: "Shop Now" },
    href: { type: String, default: "/shop" },
    placement: {
      type: String,
      enum: ["homepage_hero", "homepage_mid", "announcement"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "draft", "scheduled"],
      default: "draft",
    },
    image: { type: String },
    startsAt: { type: Date, default: Date.now },
    endsAt: { type: Date },
  },
  { timestamps: true }
);

BannerSchema.index({ placement: 1, status: 1 });

export const Banner: Model<IBanner> =
  mongoose.models.Banner ?? mongoose.model<IBanner>("Banner", BannerSchema);
