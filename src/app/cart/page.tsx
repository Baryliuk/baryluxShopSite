"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export interface CartItem {
  id: string; // `${groupId}-${variantId}`
  groupId: string;
  variantId: string;
  name: string;
  price: number;
  size: string;
  image?: string;
  quantity: number;
}

const formatPrice = (value: number) =>
  new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(value);

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // 1. Безпечне зчитування кошика з localStorage після маунту компонента
  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem("barylux_cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error("Помилка зчитування кошика з localStorage:", e);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    loadCart();

    // Слухаємо оновлення кошика з інших компонентів
    window.addEventListener("cart_updated", loadCart);
    return () => {
      window.removeEventListener("cart_updated", loadCart);
    };
  }, []);

  // 2. Збереження оновленого стейту в localStorage та відправка івенту для Header
  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem("barylux_cart", JSON.stringify(newItems));
      window.dispatchEvent(new Event("cart_updated"));
    } catch (e) {
      console.error("Помилка збереження кошика:", e);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    const updated = items
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "BARYLUX10") {
      setDiscount(0.1); // 10% знижки
    } else {
      alert("Недійсний промокод");
    }
  };

  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = rawSubtotal * discount;
  const subtotal = rawSubtotal - discountAmount;
  const shipping = subtotal > 6000 || items.length === 0 ? 0 : 199;
  const total = subtotal + shipping;

  // Під час SSR/SSG чекаємо маунту, щоб уникнути Hydration Mismatch
  if (!isMounted) {
    return (
      <div className="relative flex min-h-screen flex-col justify-between bg-[#0D0E12] text-zinc-100">
        <Header />
        <main className="flex min-h-[calc(100vh-69px)] w-full items-center justify-center px-4 py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-[#0D0E12] text-zinc-100 selection:bg-orange-500 selection:text-black">
      <Header />

      <main className="flex min-h-[calc(100vh-69px)] w-full items-start justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.25em] text-orange-400">Кошик</p>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Ваші товари
              </h1>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-orange-400/70 hover:text-white"
            >
              Продовжити покупки
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <p className="text-lg font-medium text-zinc-400">Твій кошик порожній 🛒</p>
              <Link
                href="/products"
                className="mt-4 rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-orange-400"
              >
                Перейти до каталогу
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
              <section className="space-y-4">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Зображення товару */}
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#1A1C23]">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="96px"
                            className="object-cover object-center"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-600">
                            Немає фото
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <Link
                              href={`/products/${item.groupId}`}
                              className="text-lg font-bold text-white transition hover:text-orange-400"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-0.5 text-xs text-zinc-400">
                              Розмір: <span className="font-semibold text-zinc-200">{item.size}</span>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="self-start text-xs font-medium text-red-400 hover:text-red-300 transition"
                          >
                            Видалити
                          </button>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 p-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white"
                            >
                              −
                            </button>
                            <span className="min-w-6 text-center text-sm font-semibold text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-base font-black text-white">
                              {formatPrice(item.price * item.quantity)} грн
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              <aside className="h-fit rounded-[28px] border border-orange-400/20 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">
                  Підсумок
                </h3>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Промокод
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="BARYLUX10"
                      className="w-full rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-orange-500/50"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-400"
                    >
                      OK
                    </button>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-zinc-300">
                  <div className="flex items-center justify-between">
                    <span>Підсумок</span>
                    <span>{formatPrice(subtotal)} грн</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Доставка</span>
                    <span className=" font-semibold">
                     За тарифами Нової Пошти
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
                    <span>Разом</span>
                    <span className="text-lg font-black text-orange-400">{formatPrice(total)} грн</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 w-full rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 px-5 py-3 text-base font-black text-black shadow-[0_20px_40px_rgba(251,146,60,0.4)] transition hover:brightness-110 active:scale-[0.98]"
                >
                  Оформити замовлення
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}