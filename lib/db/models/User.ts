import mongoose, { Schema, type Document, type Model } from "mongoose";

export type UserRole = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN", "SUPER_ADMIN"],
      default: "CUSTOMER",
    },
    avatar: { type: String },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);
