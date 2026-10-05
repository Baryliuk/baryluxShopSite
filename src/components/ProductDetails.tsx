'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Variant {
  id: string;
  size: string | number;
  stock: boolean | string | number;
}

interface ProductDetailsProps {
  groupId: string;
  name: string;
  price: number;
  image?: string;
  variants: Variant[];
}

// Допоміжна перевірка наявності товару
function checkStock(stock: boolean | string | number): boolean {
  if (typeof stock === 'boolean') return stock;
  if (typeof stock === 'string') return stock.toLowerCase() === 'true' || stock === '1';
  if (typeof stock === 'number') return stock > 0;
  return false;
}

export default function ProductDetails({
  groupId,
  name,
  price,
  image = '',
  variants = [],
}: ProductDetailsProps) {
  // 1. Нормалізація розмірів та варіантів
  const processedVariants = variants.map((v) => {
    const rawSize = String(v.size ?? '').trim();
    const cleanSize = rawSize.includes('(') ? rawSize.split('(')[0]?.trim() ?? rawSize : rawSize;
    return { ...v, rawSize, cleanSize, isAvailable: checkStock(v.stock) };
  });

  const cleanSizesSet = new Set(processedVariants.map((v) => v.cleanSize.toUpperCase()));
  const hasDuplicateCleanSizes = cleanSizesSet.size !== processedVariants.length;

  const validVariants = processedVariants.map((v) => ({
    ...v,
    displaySize: hasDuplicateCleanSizes ? v.rawSize : v.cleanSize,
  }));

  // 2. Стейт вибору розміру, кількості та статусу додавання
  const firstAvailable = validVariants.find((v) => v.isAvailable);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    firstAvailable ? firstAvailable.id : validVariants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const selectedVariant = validVariants.find((v) => v.id === selectedVariantId);
  const formattedPrice = new Intl.NumberFormat('uk-UA').format(price);

  // 3. Логіка додавання товару в кошик (LocalStorage + Event)
  const handleAddToCart = () => {
    if (!selectedVariant || !selectedVariant.isAvailable) return;

    const cartItem = {
      id: `${groupId}-${selectedVariant.id}`,
      groupId,
      variantId: selectedVariant.id,
      name,
      price,
      size: selectedVariant.displaySize,
      image,
      quantity,
    };

    try {
      const existingCart = JSON.parse(localStorage.getItem('barylux_cart') || '[]');
      const itemIndex = existingCart.findIndex((i: any) => i.id === cartItem.id);

      if (itemIndex > -1) {
        existingCart[itemIndex].quantity += quantity;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('barylux_cart', JSON.stringify(existingCart));

      // Сповіщаємо Header про оновлення кількості товарів у кошику
      window.dispatchEvent(new Event('cart_updated'));

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2500);
    } catch (err) {
      console.error('Помилка збереження в кошик:', err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Назва та ціна */}
      <div>
        <h1 className="text-2xl font-black text-white sm:text-3xl">{name}</h1>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">{formattedPrice}</span>
          <span className="text-base font-bold text-orange-500">грн</span>
        </div>
      </div>

      <div className="h-px w-full bg-[#262933]" />

      {/* Обирач розміру */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Оберіть розмір:
          </span>
          {selectedVariant && (
            <span className="text-xs font-semibold text-orange-500">
              Вибрано: {selectedVariant.displaySize}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {validVariants.map((variant) => {
            const isSelected = selectedVariantId === variant.id;

            return (
              <button
                key={variant.id}
                type="button"
                disabled={!variant.isAvailable}
                onClick={() => setSelectedVariantId(variant.id)}
                className={`group relative flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all duration-200 ${
                  !variant.isAvailable
                    ? 'cursor-not-allowed border-[#262933]/50 bg-[#0D0E12]/50 opacity-40 text-zinc-600'
                    : isSelected
                      ? 'border-orange-400 bg-orange-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.35)] font-extrabold'
                      : 'border-[#262933] bg-[#121319] text-zinc-300 hover:border-orange-500/50 hover:text-white'
                }`}
              >
                <span className="text-xs font-extrabold uppercase">
                  {variant.displaySize}
                </span>

                <span
                  className={`mt-1 text-[9px] font-medium ${
                    isSelected ? 'text-black/80 font-bold' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                >
                  {variant.isAvailable ? 'В наявності' : 'Немає'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Лічильник кількості */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Кількість:
        </span>
        <div className="inline-flex items-center gap-2 rounded-xl border border-[#262933] bg-[#121319] p-1">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm font-bold text-white">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            +
          </button>
        </div>
      </div>

      {/* Кнопки дій */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          type="button"
          disabled={!selectedVariant?.isAvailable}
          onClick={handleAddToCart}
          className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
            !selectedVariant?.isAvailable
              ? 'cursor-not-allowed border border-[#262933] bg-[#121319] text-zinc-600'
              : isAdded
                ? 'bg-emerald-500 text-black shadow-[0_4px_25px_rgba(16,185,129,0.35)]'
                : 'bg-orange-500 text-black hover:bg-orange-400 shadow-[0_4px_25px_rgba(249,115,22,0.3)]'
          }`}
        >
          {isAdded ? '✓ Додано у кошик!' : 'Додати в кошик 🛒'}
        </button>

        {isAdded && (
          <Link
            href="/cart"
            className="flex w-full items-center justify-center rounded-2xl border border-orange-500/40 bg-orange-500/10 py-3 text-xs font-bold uppercase text-orange-400 transition hover:bg-orange-500/20"
          >
            Перейти до оформлення →
          </Link>
        )}
      </div>
    </div>
  );
}