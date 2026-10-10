// app/checkout/_components/CheckoutForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartItem } from "@/app/cart/page";
import { createOrderAction } from "@/app/actions/order";

const formatPrice = (val: number) =>
  new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(val);

interface CheckoutFormProps {
  initialCustomer: {
    fullName: string;
    phone: string;
    email: string;
  };
  initialDelivery: {
    city: string;
    warehouse: string;
  };
}

export default function CheckoutForm({ initialCustomer, initialDelivery }: CheckoutFormProps) {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Ініціалізуємо фоми початковими даними з профілю
  const [fullName, setFullName] = useState(initialCustomer.fullName);
  const [phone, setPhone] = useState(initialCustomer.phone);
  const [email, setEmail] = useState(initialCustomer.email);
  const [city, setCity] = useState(initialDelivery.city);
  const [warehouse, setWarehouse] = useState(initialDelivery.warehouse);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem("barylux_cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Error parsing cart:", e);
    }
  }, []);

  const rawSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (items.length === 0) {
      setErrorMsg("Ваш кошик порожній");
      return;
    }

    setIsSubmitting(true);

    const res = await createOrderAction({
      customer: { fullName, phone, email },
      delivery: { city, warehouse },
      items,
      paymentMethod,
    });

    setIsSubmitting(false);

    if (res.success) {
      localStorage.removeItem("barylux_cart");
      window.dispatchEvent(new Event("cart_updated"));
      router.push(`/success`);
    } else {
      setErrorMsg(res.error || "Не вдалося оформити замовлення");
    }
  };

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center py-16 text-center">
        <h2 className="text-xl font-bold uppercase text-white">Кошик порожній</h2>
        <p className="mt-2 text-xs text-zinc-400">Додайте товари, щоб оформити замовлення.</p>
        <Link
          href="/products"
          className="mt-6 rounded-xl bg-white px-6 py-2.5 font-mono text-xs font-bold uppercase text-black"
        >
          До каталогу
        </Link>
      </div>
    );
  }

  return (
    <>
      {errorMsg && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 font-mono text-xs text-red-400">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <div className="space-y-6">
          {/* 1. Contact Info */}
          <div className="rounded-2xl border border-[#1C1E24] bg-[#0E0E11] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                1. Контактні дані
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                  ПІБ отримувача *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Шевченко Тарас Григорович"
                  className="w-full rounded-xl border border-[#1C1E24] bg-[#121318] px-3.5 py-2.5 font-mono text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+380 67 000 00 00"
                    className="w-full rounded-xl border border-[#1C1E24] bg-[#121318] px-3.5 py-2.5 font-mono text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full rounded-xl border border-[#1C1E24] bg-[#121318] px-3.5 py-2.5 font-mono text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Delivery Info */}
          <div className="rounded-2xl border border-[#1C1E24] bg-[#0E0E11] p-6">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-4">
              2. Доставка (Нова Пошта)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                  Місто *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Київ"
                  className="w-full rounded-xl border border-[#1C1E24] bg-[#121318] px-3.5 py-2.5 font-mono text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase text-zinc-400 mb-1">
                  Відділення або поштомат *
                </label>
                <input
                  type="text"
                  required
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  placeholder="Відділення №1"
                  className="w-full rounded-xl border border-[#1C1E24] bg-[#121318] px-3.5 py-2.5 font-mono text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-500"
                />
              </div>
            
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="rounded-2xl border border-[#1C1E24] bg-[#0E0E11] p-6">
            <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-4">
              3. Спосіб оплати
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition ${
                  paymentMethod === "cod"
                    ? "border-white bg-zinc-900"
                    : "border-[#1C1E24] bg-[#121318] hover:border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="sr-only"
                />
                <span className="font-mono text-xs font-bold uppercase text-white">
                  Накладений платіж
                </span>
                <span className="mt-1 font-mono text-[10px] text-zinc-500">
                  Оплата при отриманні на НП
                </span>
              </label>

              <label
                className={`flex cursor-pointer flex-col justify-between rounded-xl border p-4 transition ${
                  paymentMethod === "card"
                    ? "border-white bg-zinc-900"
                    : "border-[#1C1E24] bg-[#121318] hover:border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="sr-only"
                />
                <span className="font-mono text-xs font-bold uppercase text-white">
                  Онлайн-оплата
                </span>
                <span className="mt-1 font-mono text-[10px] text-zinc-500">
                  Visa / Mastercard / Apple Pay
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <aside className="h-fit space-y-4">
          <div className="rounded-2xl border border-[#1C1E24] bg-[#0E0E11] p-6">
            <h2 className="border-b border-[#1C1E24] pb-3 font-mono text-xs font-bold uppercase tracking-wider text-white">
              Замовлення ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>

            <div className="mt-4 max-h-60 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs font-mono">
                  <div>
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-[10px] text-zinc-500">
                      {item.size} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-zinc-300">
                    {formatPrice(item.price * item.quantity)} грн
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 border-t border-[#1C1E24] pt-4 font-mono text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Сума</span>
                <span>{formatPrice(rawSubtotal)} грн</span>
              </div>
              <div className="flex justify-between">
                <span>Доставка</span>
                <span className="text-zinc-500">За тарифами НП</span>
              </div>
              <div className="flex justify-between border-t border-[#1C1E24] pt-3 font-bold text-white text-sm">
                <span>РАЗОМ</span>
                <span>{formatPrice(rawSubtotal)} грн</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-white py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-black transition hover:bg-zinc-200 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Оформлення..." : "Підтвердити замовлення"}
            </button>
          </div>
        </aside>
      </form>
    </>
  );
}