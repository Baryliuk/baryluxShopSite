import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    deliveryAddress: {
      city: { type: String },
      warehouse: { type: String },
      phone: { type: String },
    },
  },
  { timestamps: true }
);

// СУВОРЕ ПРАВИЛО ДЛЯ NEXT.JS: перевикористовуємо існуючу модель з models, якщо вона вже скомпільована
const User = models.User || model("User", UserSchema);

export default User;