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
  
  // State для промокоду
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoStatus, setPromoStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // 1. Зчитання з localStorage
  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem("barylux_cart");
      setItems(savedCart ? JSON.parse(savedCart) : []);
    } catch (e) {
      console.error("Помилка зчитування кошика з localStorage:", e);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    loadCart();

    window.addEventListener("cart_updated", loadCart);
    return () => {
      window.removeEventListener("cart_updated", loadCart);
    };
  }, []);

  // 2. Мутація стейту та синхронізація
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
    setPromoStatus(null);
    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === "BARYLUX10") {
      setDiscount(0.1);
      setPromoStatus({ type: "success", msg: "Промокод застосовано (-10%)" });
    } else {
      setDiscount(0);
      setPromoStatus({ type: "error", msg: "Недійсний промокод" });
    }
  };

  // Розрахунок підсумку
  const rawSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = rawSubtotal * discount;
  const subtotal = rawSubtotal - discountAmount;

  if (!isMounted) {
    return (
      <div className="relative flex min-h-screen flex-col justify-between bg-[#0A0A0C] text-zinc-100">
        <Header />
        <main className="flex min-h-[calc(100vh-69px)] w-full items-center justify-center px-4 py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-[#0A0A0C] text-zinc-100 selection:bg-white selection:text-black">
      <Header />

      <main className="flex min-h-[calc(100vh-69px)] w-full items-start justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          {/* Header section */}
          <div className="mb-8 flex flex-col gap-4 border-b border-[#1C1E24] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                [ CART SUMMARY ]
              </span>
              <h1 className="mt-1 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                Ваш кошик ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h1>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              ← До каталогу
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#1C1E24] bg-[#0E0E11] p-8 text-center">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                Кошик порожній
              </span>
              <p className="mt-2 text-sm text-zinc-400 font-light">
                Ви ще не додали жодного товару до вашого вибору.
              </p>
              <Link
                href="/products"
                className="mt-6 rounded-xl bg-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black transition hover:bg-zinc-200 active:scale-95"
              >
                Переглянути колекцію
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
              {/* Items List */}
              <section className="space-y-3">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl border border-[#1C1E24] bg-[#0E0E11] p-4 transition hover:border-zinc-700"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-[#121318]">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover object-center"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-mono text-[10px] uppercase text-zinc-600">
                            N/A
                          </div>
                        )}
                      </div>

                      {/* Info & Controls */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              href={`/products/${item.groupId}`}
                              className="text-sm font-bold uppercase tracking-wide text-white transition hover:text-zinc-400"
                            >
                              {item.name}
                            </Link>
                            <p className="mt-0.5 font-mono text-xs text-zinc-500">
                              Розмір: <span className="text-zinc-200">{item.size}</span>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 hover:text-red-400 transition"
                          >
                            Видалити
                          </button>
                        </div>

                        <div className="flex items-end justify-between pt-2">
                          {/* Counter */}
                          <div className="inline-flex items-center rounded-lg border border-[#1C1E24] bg-[#121318]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="flex h-7 w-7 items-center justify-center font-mono text-xs text-zinc-400 transition hover:text-white"
                            >
                              −
                            </button>
                            <span className="min-w-6 text-center font-mono text-xs font-bold text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="flex h-7 w-7 items-center justify-center font-mono text-xs text-zinc-400 transition hover:text-white"
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <span className="font-mono text-sm font-bold text-white">
                            {formatPrice(item.price * item.quantity)} грн
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              {/* Order Summary Sidebar */}
              <aside className="h-fit rounded-2xl border border-[#1C1E24] bg-[#0E0E11] p-6">
                <h2 className="border-b border-[#1C1E24] pb-3 text-xs font-bold uppercase tracking-wider text-white">
                  Підсумок замовлення
                </h2>

                {/* Promo Code Form */}
                <div className="mt-4">
                  <label className="block font-mono text-[10px] uppercase text-zinc-500 mb-1.5">
                    Промокод
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="BARYLUX10"
                      className="w-full rounded-xl border border-[#1C1E24] bg-[#121318] px-3 py-2 font-mono text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-500 uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-zinc-700 active:scale-95"
                    >
                      OK
                    </button>
                  </div>
                  {promoStatus && (
                    <p
                      className={`mt-2 font-mono text-[10px] ${
                        promoStatus.type === "success" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {promoStatus.msg}
                    </p>
                  )}
                </div>

                {/* Calculation breakdown */}
                <div className="mt-6 space-y-3 font-mono text-xs text-zinc-400 border-t border-[#1C1E24] pt-4">
                  <div className="flex justify-between">
                    <span>Товари ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
                    <span>{formatPrice(rawSubtotal)} грн</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Знижка ({(discount * 100).toFixed(0)}%)</span>
                      <span>-{formatPrice(discountAmount)} грн</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Доставка</span>
                    <span className="text-zinc-500">За тарифами НП</span>
                  </div>

                  <div className="flex justify-between border-t border-[#1C1E24] pt-3 text-sm font-bold text-white">
                    <span className="uppercase">Разом</span>
                    <span className="font-mono">{formatPrice(subtotal)} грн</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-white py-3 font-mono text-xs font-bold uppercase tracking-wider text-black transition hover:bg-zinc-200 active:scale-95"
                >
                  Оформити замовлення
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}