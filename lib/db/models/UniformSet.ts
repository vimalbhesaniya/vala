import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IUniformSetItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
}

export interface IUniformSet extends Document {
  schoolId: Types.ObjectId;
  name: string;
  slug: string;
  grade: string;
  gender: string;
  items: IUniformSetItem[];
  individualTotal: number;
  setPrice: number;
  savings: number;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const UniformSetItemSchema = new Schema<IUniformSetItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const UniformSetSchema = new Schema<IUniformSet>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    grade: { type: String, required: true },
    gender: { type: String, required: true },
    items: { type: [UniformSetItemSchema], default: [] },
    individualTotal: { type: Number, required: true },
    setPrice: { type: Number, required: true },
    savings: { type: Number, required: true },
    status: { type: String, enum: ["active", "archived"], default: "active" },
  },
  { timestamps: true }
);

UniformSetSchema.index({ schoolId: 1, status: 1 });

export const UniformSet: Model<IUniformSet> =
  mongoose.models.UniformSet ??
  mongoose.model<IUniformSet>("UniformSet", UniformSetSchema);
