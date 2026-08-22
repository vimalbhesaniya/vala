import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IReview extends Document {
  productId: Types.ObjectId;
  userId?: Types.ObjectId;
  customerName: string;
  rating: number;
  comment: string;
  verified: boolean;
  status: "approved" | "pending" | "hidden";
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    verified: { type: Boolean, default: false },
    status: { type: String, enum: ["approved", "pending", "hidden"], default: "approved" },
  },
  { timestamps: true }
);

ReviewSchema.index({ productId: 1, status: 1 });

export const Review: Model<IReview> =
  mongoose.models.Review ?? mongoose.model<IReview>("Review", ReviewSchema);
