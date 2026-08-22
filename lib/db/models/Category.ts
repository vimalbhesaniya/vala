import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  image: string;
  description?: string;
  productCount: number;
  sortOrder: number;
  status: "active" | "inactive";
  parentId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String, required: true },
    description: { type: String },
    productCount: { type: Number, default: 0 },
    sortOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    parentId: { type: Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

CategorySchema.index({ slug: 1 });
CategorySchema.index({ status: 1, sortOrder: 1 });

export const Category: Model<ICategory> =
  mongoose.models.Category ??
  mongoose.model<ICategory>("Category", CategorySchema);
