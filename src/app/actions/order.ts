"server-only";
"use server"; 

import { auth } from "@/auth";
import { connectToDB } from "@/lib/mongodb";
import Order, { IOrderItem } from "@/models/Order";
import User from "@/models/User";

interface CreateOrderInput {
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
  promoCode?: string;
  paymentMethod: "cod" | "card";
}

export async function createOrderAction(data: CreateOrderInput) {
  try {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: "Кошик порожній" };
    }

    if (!data.customer.fullName || !data.customer.phone || !data.customer.email) {
      return { success: false, error: "Заповніть усі контактні дані" };
    }

    if (!data.delivery.city || !data.delivery.warehouse) {
      return { success: false, error: "Вкажіть місто та відділення Нової Пошти" };
    }

    await connectToDB();

    const session = await auth();
    const userEmail = session?.user?.email || data.customer.email;

    // Розрахунок цін на сервері (запобігає маніпуляціям із localStorage)
    const rawSubtotal = data.items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    // Валідація промокоду на сервері
    let discountPercent = 0;
    if (data.promoCode && data.promoCode.trim().toUpperCase() === "BARYLUX10") {
      discountPercent = 0.1;
    }

    const discountAmount = rawSubtotal * discountPercent;
    const totalAmount = rawSubtotal - discountAmount;

    // Генерація унікального номера замовлення
    const orderNumber = `BL-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = await Order.create({
      orderNumber,
      userEmail: session?.user?.email || null,
      customer: data.customer,
      delivery: data.delivery,
      items: data.items,
      subtotal: rawSubtotal,
      discount: discountAmount,
      totalAmount,
      paymentMethod: data.paymentMethod,
      status: "pending",
    });

    // Оновлюємо збережені реквізити доставки у профілі користувача, якщо він авторизований
    if (session?.user?.email) {
      await User.findOneAndUpdate(
        { email: session.user.email },
        {
          $set: {
            deliveryAddress: {
              fullName: data.customer.fullName,
              phone: data.customer.phone,
              city: data.delivery.city,
              warehouse: data.delivery.warehouse,
            },
          },
        }
      );
    }

    return {
      success: true,
      orderNumber: newOrder.orderNumber,
      orderId: newOrder._id.toString(),
    };
  } catch (error) {
    console.error("[CREATE_ORDER_ERROR]:", error);
    return { success: false, error: "Помилка під час створення замовлення" };
  }
}