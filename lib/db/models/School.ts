import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISchool extends Document {
  name: string;
  slug: string;
  logo: string;
  city: string;
  state: string;
  description?: string;
  contact?: string;
  productCount: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSchema = new Schema<ISchool>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    logo: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    description: { type: String },
    contact: { type: String },
    productCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

SchoolSchema.index({ slug: 1 });
SchoolSchema.index({ status: 1 });
SchoolSchema.index({ city: 1, state: 1 });

export const School: Model<ISchool> =
  mongoose.models.School ?? mongoose.model<ISchool>("School", SchoolSchema);
