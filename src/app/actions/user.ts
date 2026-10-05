"use server";

import { auth } from "@/auth";
import { connectToDB } from "@/lib/mongodb"; // Твоя функція підключення до MongoDB
import User from "@/models/User"; // Твоя Mongoose модель User
import { revalidatePath } from "next/cache";

export interface DeliveryData {
  city: string;
  warehouse: string;
  phone: string;
}

export async function updateDeliveryAddress(data: DeliveryData) {
  try {
    // 1. Перевіряємо, чи користувач залогінений
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Неавторизований доступ" };
    }

    // 2. Валідація базових полів
    if (!data.city.trim() || !data.warehouse.trim() || !data.phone.trim()) {
      return { success: false, error: "Усі поля повинні бути заповнені" };
    }

    // 3. Підключаємось до БД
    await connectToDB();

    // 4. Оновлюємо дані користувача за email
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          deliveryAddress: {
            city: data.city.trim(),
            warehouse: data.warehouse.trim(),
            phone: data.phone.trim(),
          },
        },
      },
      { new: true, upsert: true }
    );

    if (!updatedUser) {
      return { success: false, error: "Не вдалося оновити дані" };
    }

    // 5. Оновлюємо кеш Next.js для сторінки профілю
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Помилка оновлення адреси доставки:", error);
    return { success: false, error: "Внутрішня помилка сервера" };
  }
}