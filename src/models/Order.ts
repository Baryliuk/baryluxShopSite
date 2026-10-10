import { Schema, model, models } from "mongoose";

export interface IOrderItem {
  id: string;
  groupId: string;
  variantId: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image?: string;
}

export interface IOrder {
  _id?: string;
  orderNumber: string;
  userEmail?: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
  };
  delivery: {
    city: string;
    warehouse: string;
    notes?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentMethod: "cod" | "card";
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userEmail: { type: String, default: null },
    customer: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    delivery: {
      city: { type: String, required: true },
      warehouse: { type: String, required: true },
      notes: { type: String, default: "" },
    },
    items: [
      {
        id: { type: String, required: true },
        groupId: { type: String, required: true },
        variantId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "card"], default: "cod" },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = models.Order || model<IOrder>("Order", OrderSchema);
export default Order;