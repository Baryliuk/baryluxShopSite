import { Schema, model, models, InferSchemaType, Model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    deliveryAddress: {
      city: { type: String, default: "" },
      warehouse: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export type IUser = InferSchemaType<typeof UserSchema>;

// Обов'язково вказуємо Model<IUser> для типізації методів findOne / findOneAndUpdate
const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);

export default User;