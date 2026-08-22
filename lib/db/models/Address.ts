import mongoose, { Schema, type Document, type Model, Types } from "mongoose";

export interface IAddress extends Document {
  userId: Types.ObjectId;
  label: "home" | "work" | "other";
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    label: { type: String, enum: ["home", "work", "other"], default: "home" },
    name: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Address: Model<IAddress> =
  mongoose.models.Address ?? mongoose.model<IAddress>("Address", AddressSchema);

export function serializeAddress(doc: IAddress) {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    label: doc.label,
    name: doc.name,
    line1: doc.line1,
    line2: doc.line2,
    city: doc.city,
    state: doc.state,
    pincode: doc.pincode,
    phone: doc.phone,
    isDefault: doc.isDefault,
  };
}
