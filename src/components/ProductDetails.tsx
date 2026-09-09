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
  // 1. Нормалізуємо варіанти
  const processedVariants = variants.map((v) => {
    const rawSize = String(v.size ?? '').trim();
    const cleanSize = rawSize.includes('(') ? rawSize.split('(')[0].trim() : rawSize;
    return { ...v, rawSize, cleanSize };
  });

  const cleanSizesSet = new Set(processedVariants.map((v) => v.cleanSize.toUpperCase()));
  const hasDuplicateCleanSizes = cleanSizesSet.size !== processedVariants.length;

  const validVariants = processedVariants.map((v) => ({
    ...v,
    displaySize: hasDuplicateCleanSizes ? v.rawSize : v.cleanSize,
  }));

  // 2. Стейт за унікальним ID
  const firstAvailable = validVariants.find((v) => Boolean(v.stock));
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    firstAvailable ? firstAvailable.id : validVariants[0]?.id || ''
  );

  const selectedVariant = validVariants.find((v) => v.id === selectedVariantId);
  const formattedPrice = new Intl.NumberFormat('uk-UA').format(price);

  const [copied, setCopied] = useState(false);

  const handleInstagramOrder = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const currentSizeText = selectedVariant ? selectedVariant.displaySize : 'Не вибрано';
    const messageText = `Вітаю! Хочу оформити замовлення:\n📦 Товар: ${name}\n📏 Розмір/Варіант: ${currentSizeText}\n💰 Ціна: ${formattedPrice} грн`;
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
      <div>
        <h1 className="text-2xl font-black text-white sm:text-3xl">{name}</h1>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-white">{formattedPrice}</span>
          <span className="text-base font-bold text-orange-500">грн</span>
        </div>
      </div>

      <div className="h-px w-full bg-[#262933]" />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Оберіть варіант:
          </span>
          {selectedVariant && (
            <span className="text-xs font-semibold text-orange-500">
              Вибрано: {selectedVariant.displaySize}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {validVariants.map((variant) => {
            const isAvailable = Boolean(variant.stock);
            const isSelected = selectedVariantId === variant.id;

            return (
              <button
                key={variant.id}
                type="button"
                disabled={!isAvailable}
                onClick={() => setSelectedVariantId(variant.id)}
                className={`group relative flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all duration-200 ${
                  !isAvailable
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
                  {isAvailable ? 'В наявності' : 'Немає'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <a
          href={`https://ig.me/m/${instagramUsername}`}
          onClick={handleInstagramOrder}
          className={`flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
            copied
              ? 'bg-emerald-500 text-black shadow-[0_4px_25px_rgba(16,185,129,0.35)]'
              : 'bg-orange-500 text-black hover:bg-orange-400 shadow-[0_4px_25px_rgba(249,115,22,0.3)]'
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