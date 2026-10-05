"use server";

import { auth } from "@/auth";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export interface DeliveryData {
  city: string;
  warehouse: string;
  phone: string;
}

// Проста валідація українського телефону
const PHONE_REGEX = /^(\+?38)?0\d{9}$/;

export async function updateDeliveryAddress(data: DeliveryData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Неавторизований доступ" };
    }

    const city = data.city.trim();
    const warehouse = data.warehouse.trim();
    const phone = data.phone.trim().replace(/\s+/g, "");

    // 1. Перевірка на порожні поля
    if (!city || !warehouse || !phone) {
      return { success: false, error: "Усі поля повинні бути заповнені" };
    }

    // 2. Обмеження довжини (захист від спаму)
    if (city.length > 100 || warehouse.length > 150) {
      return { success: false, error: "Занадто довгі значення у полях" };
    }

    // 3. Валідація телефону
    if (!PHONE_REGEX.test(phone)) {
      return { success: false, error: "Некоректний формат телефону (наприклад, +380671234567)" };
    }

    await connectToDB();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          deliveryAddress: { city, warehouse, phone },
        },
      },
      { new: true, upsert: true }
    );

    if (!updatedUser) {
      return { success: false, error: "Не вдалося оновити дані" };
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Помилка оновлення адреси доставки:", error);
    return { success: false, error: "Внутрішня помилка сервера" };
  }
}