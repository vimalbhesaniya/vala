import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usageCount: number;
  customerUsageLimit: number;
  startsAt: Date;
  expiresAt: Date;
  status: "active" | "expired" | "scheduled";
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    usageLimit: { type: Number, default: 100 },
    usageCount: { type: Number, default: 0 },
    customerUsageLimit: { type: Number, default: 1 },
    startsAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ["active", "expired", "scheduled"], default: "active" },
  },
  { timestamps: true }
);

CouponSchema.index({ code: 1 });

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon ?? mongoose.model<ICoupon>("Coupon", CouponSchema);
