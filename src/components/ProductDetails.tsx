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
  instagramUsername?: string;
}

export default function ProductDetails({
  name,
  price,
  variants = [],
  instagramUsername = 'barylux.ua',
}: ProductDetailsProps) {
  const validVariants = variants.map((v) => {
    let sizeStr = String(v.size ?? '').trim().toUpperCase();
    if (sizeStr.includes('(')) sizeStr = sizeStr.split('(')[0].trim();
    return { ...v, cleanSize: sizeStr };
  });

  const firstAvailable = validVariants.find((v) => v.stock);
  const [selectedSize, setSelectedSize] = useState<string>(
    firstAvailable ? firstAvailable.cleanSize : ''
  );

  const formattedPrice = new Intl.NumberFormat('uk-UA').format(price);

  const [copied, setCopied] = useState(false);
  const handleInstagramOrder = async (e: React.MouseEvent<HTMLAnchorElement>) => {

    e.preventDefault();

    const messageText = `Вітаю! Хочу оформити замовлення:\n📦 Товар: ${name}\n📏 Розмір: ${selectedSize || 'Не вибрано'}\n💰 Ціна: ${formattedPrice} грн`;
    const igUrl = `https://ig.me/m/${instagramUsername}`;

    try {
      await navigator.clipboard.writeText(messageText);
    } catch (err) {
      console.error('Помилка копіювання:', err);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    setTimeout(() => {
      window.location.href = igUrl;
    }, 700);
  };
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
                className={`group relative flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200 ${!isAvailable
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


      <div className="flex flex-col gap-2">
        <a
          href={`https://ig.me/m/${instagramUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleInstagramOrder}
          className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 ${copied
              ? 'bg-emerald-600 shadow-[0_4px_25px_rgba(16,185,129,0.4)]'
              : 'bg-gradient-to-r from-[#950740] to-[#C3073F] shadow-[0_4px_25px_rgba(195,7,63,0.4)]'
            }`}
        >
          {copied ? '✓ Текст скопійовано!' : 'Замовити в Instagram'}
        </a>

        {copied && (
          <p className="animate-fade-in text-center text-xs font-semibold text-emerald-400">
            📋 Деталі в буфері. Затисніть поле в чаті та натисніть «Вставити».
          </p>
        )}
      </div>
    </div>
  );
}