import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IProductVariant {
  size: string;
  color: string;
  sku: string;
  price: number;
  comparePrice: number;
  stock: number;
  weight?: number;
}

export interface IProduct extends Document {
  schoolId: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  images: string[];
  variants: IProductVariant[];
  gender: "boys" | "girls" | "unisex";
  grade?: string;
  material?: string;
  season?: string;
  tags: string[];
  badge?: "bestseller" | "new" | "sale";
  rating: number;
  reviewCount: number;
  status: "active" | "draft" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    size: { type: String, required: true },
    color: { type: String, required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    comparePrice: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    weight: { type: Number },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    variants: { type: [ProductVariantSchema], default: [] },
    gender: { type: String, enum: ["boys", "girls", "unisex"], required: true },
    grade: { type: String },
    material: { type: String },
    season: { type: String },
    tags: [{ type: String }],
    badge: { type: String, enum: ["bestseller", "new", "sale"] },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "draft", "archived"], default: "active" },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ schoolId: 1, status: 1 });
ProductSchema.index({ categoryId: 1, status: 1 });
ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ "variants.sku": 1 });

export const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);
