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

  const firstAvailable = validVariants.find((v) => v.isAvailable);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    firstAvailable ? firstAvailable.id : validVariants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const selectedVariant = validVariants.find((v) => v.id === selectedVariantId);
  const formattedPrice = new Intl.NumberFormat('uk-UA').format(price);

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
      window.dispatchEvent(new Event('cart_updated'));

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2500);
    } catch (err) {
      console.error('Помилка збереження в кошик:', err);
    }
  };

  return (
    /* Sticky контейнер для UX: Панель залишається у фокусі при скролі галереї */
    <div className="sticky top-24 flex flex-col justify-between gap-8 text-white">
      
      {/* 1. Заголовок + Ціна + Арт-номер (Захищений блоковий UX) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          <span>Артикул: #{groupId.slice(-6)}</span>
          <span>В наявності</span>
        </div>
        
        <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl lg:text-5xl">
          {name}
        </h1>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-3xl font-extrabold tracking-tight">{formattedPrice}</span>
          <span className="font-mono text-xs uppercase text-zinc-500">UAH</span>
        </div>
      </div>

      <div className="h-px w-full bg-[#1C1E24]" />

      {/* 2. Вибір розміру (UX: Чистий мінімалізм, без зайвих підписів) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            Розмір
          </span>
          <span className="text-[11px] font-medium text-zinc-500">
            {selectedVariant ? `Обрано: ${selectedVariant.displaySize}` : 'Оберіть розмір'}
          </span>
        </div>

        {/* Геометрична сітка 4 в ряд з акцентною рамкою */}
        <div className="grid grid-cols-4 gap-2">
          {validVariants.map((variant) => {
            const isSelected = selectedVariantId === variant.id;

            return (
              <button
                key={variant.id}
                type="button"
                disabled={!variant.isAvailable}
                onClick={() => setSelectedVariantId(variant.id)}
                className={`relative flex h-12 items-center justify-center font-mono text-xs transition-all duration-200 ${
                  !variant.isAvailable
                    ? 'cursor-not-allowed border border-[#1C1E24]/40 bg-[#0A0A0C] text-zinc-700 line-through'
                    : isSelected
                      ? 'bg-white font-extrabold text-black ring-2 ring-white ring-offset-2 ring-offset-[#0A0A0C]'
                      : 'border border-[#1C1E24] bg-[#0E0E11] font-bold text-zinc-300 hover:border-zinc-500 hover:text-white'
                }`}
              >
                {variant.displaySize}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Кількість + Додавання в кошик (Layout у 1 рядок на десктопі для економії місця) */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex gap-3">
          
          {/* Стріп-степер кількості */}
          <div className="flex h-14 items-center rounded-none border border-[#1C1E24] bg-[#0E0E11] px-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-10 w-8 items-center justify-center font-mono text-zinc-400 hover:text-white"
            >
              −
            </button>
            <span className="w-8 text-center font-mono text-xs font-bold">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-10 w-8 items-center justify-center font-mono text-zinc-400 hover:text-white"
            >
              +
            </button>
          </div>

          {/* Головна CTA кнопка */}
          <button
            type="button"
            disabled={!selectedVariant?.isAvailable}
            onClick={handleAddToCart}
            className={`flex h-14 flex-1 items-center justify-center text-xs font-extrabold uppercase tracking-[0.2em] transition-all duration-300 ${
              !selectedVariant?.isAvailable
                ? 'cursor-not-allowed border border-[#1C1E24] bg-[#0E0E11] text-zinc-600'
                : isAdded
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white text-black hover:bg-zinc-200 active:scale-[0.98]'
            }`}
          >
            {isAdded ? '✓ Додано' : 'В кошик'}
          </button>
        </div>

        {isAdded && (
          <Link
            href="/cart"
            className="flex h-12 items-center justify-center border border-[#1C1E24] bg-[#0E0E11] text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:border-white hover:text-white"
          >
            Оформити замовлення →
          </Link>
        )}
      </div>

      {/* 4. Аккордеон з інформацією про доставку (Додає ваги та довіри бренду) */}
      <div className="border-t border-[#1C1E24] pt-4 text-xs text-zinc-400 space-y-2">
        <div className="flex justify-between py-1">
          <span className="font-semibold text-zinc-300">Доставка:</span>
          <span>Нова Пошта (1-2 дні)</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="font-semibold text-zinc-300">Оплата:</span>
          <span>При отриманні / Карткою</span>
        </div>
      </div>

    </div>
  );
}