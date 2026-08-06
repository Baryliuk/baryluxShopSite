'use client';

import { useState } from 'react';

interface Variant {
  id: string;
  size: string | number;
  stock: boolean | number;
}

interface ProductDetailsProps {
  name: string;
  price: number;
  variants: Variant[];
  instagramUsername?: string; // Наприклад "barylux.shop"
}

export default function ProductDetails({
  name,
  price,
  variants = [],
  instagramUsername = 'barylux.ua', // Вкажи свій юзернейм Instagram
}: ProductDetailsProps) {
  // Фільтруємо варіанти і нормалізуємо розміри
  const validVariants = variants.map((v) => {
    let sizeStr = String(v.size ?? '').trim().toUpperCase();
    if (sizeStr.includes('(')) sizeStr = sizeStr.split('(')[0].trim();
    return { ...v, cleanSize: sizeStr };
  });

  // За замовчуванням вибираємо перший доступний розмір
  const firstAvailable = validVariants.find((v) => v.stock);
  const [selectedSize, setSelectedSize] = useState<string>(
    firstAvailable ? firstAvailable.cleanSize : ''
  );

  const formattedPrice = new Intl.NumberFormat('uk-UA').format(price);

  // Формуємо готовий текст для direct в Instagram
  const messageText = `Вітаю! Хочу оформити замовлення:\n📦 Товар: ${name}\n📏 Розмір: ${selectedSize || 'Не вибрано'}\n💰 Ціна: ${formattedPrice} грн`;
  
  // Пряме посилання на Direct Instagram із шаблоном повідомлення
  const instagramUrl = `https://ig.me/m/${instagramUsername}?text=${encodeURIComponent(messageText)}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Назва та ціна */}
      <div>
        <h1 className="text-2xl font-black text-white sm:text-3xl">{name}</h1>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">{formattedPrice}</span>
          <span className="text-base font-bold text-[#C3073F]">грн</span>
        </div>
      </div>

      <div className="h-px w-full bg-[#6F2232]/30" />

      {/* Вибір розмірів та залишки */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Оберіть розмір:
          </span>
          {selectedSize && (
            <span className="text-xs font-semibold text-[#C3073F]">
              Вибрано: {selectedSize}
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {validVariants.map((variant, index) => {
            const isAvailable = Boolean(variant.stock);
            const isSelected = selectedSize === variant.cleanSize;

            return (
              <button
                key={`${variant.cleanSize}-${index}`}
                type="button"
                disabled={!isAvailable}
                onClick={() => setSelectedSize(variant.cleanSize)}
                className={`group relative flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200 ${
                  !isAvailable
                    ? 'cursor-not-allowed border-gray-800 bg-[#121214]/40 opacity-40'
                    : isSelected
                    ? 'border-[#C3073F] bg-[#950740] text-white shadow-[0_0_15px_rgba(195,7,63,0.4)]'
                    : 'border-[#6F2232]/40 bg-[#121214] text-gray-300 hover:border-[#950740] hover:text-white'
                }`}
              >
                <span className="text-xs font-black uppercase">
                  {variant.cleanSize}
                </span>

                {/* Індикатор кількості/наявності */}
                <span className="mt-1 text-[9px] font-medium text-gray-400 group-hover:text-gray-200">
                  {isAvailable ? 'В наявності' : 'Немає'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Кнопка Купити через Instagram */}
      <div className="mt-4 flex flex-col gap-3">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#950740] to-[#C3073F] py-4 text-xs font-black uppercase tracking-widest text-white shadow-[0_4px_25px_rgba(195,7,63,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_30px_rgba(195,7,63,0.6)] active:scale-[0.98]"
        >
          <svg
            className="h-5 w-5 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          Замовити в Instagram
        </a>
      </div>
    </div>
  );
}