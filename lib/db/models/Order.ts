import mongoose, { Schema, type Document, type Model, Types } from "mongoose";
import type { OrderStatus, PaymentMethod, PaymentStatus, DeliveryMethod } from "@/types/order";

export interface IOrderItem {
  productId: Types.ObjectId;
  productSlug: string;
  name: string;
  image: string;
  schoolName: string;
  size: string;
  sku: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId?: Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryMethod: DeliveryMethod;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  address: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
  estimatedDelivery?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productSlug: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    schoolName: { type: String, required: true },
    size: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true },
    customerPhone: { type: String, required: true },
    items: { type: [OrderItemSchema], default: [] },
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    paymentMethod: { type: String, enum: ["cod", "mock_online"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    deliveryMethod: { type: String, enum: ["standard", "express"], default: "standard" },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    address: {
      name: { type: String, required: true },
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    estimatedDelivery: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ status: 1 });

export const Order: Model<IOrder> =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);
