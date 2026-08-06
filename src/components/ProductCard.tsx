// src/components/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { ProductItem } from './ProductGrid';

interface ProductCardProps {
  product: ProductItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Форматування ціни (наприклад, 1 599 ₴)
  const formattedPrice = new Intl.NumberFormat('uk-UA').format(product.price);

  return (
    <Link
      href={`/products/${product.group_id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#6F2232]/20 bg-[#121214] transition-all duration-300 hover:-translate-y-1 hover:border-[#950740]/50 hover:shadow-[0_10px_30px_rgba(149,7,64,0.15)]"
    >
      {/* 1. КОНТЕЙНЕР ДЛЯ ЗОБРАЖЕННЯ */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#1A1A1D]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-between text-xs text-gray-600">
            Немає фото
          </div>
        )}

        {/* Затемнення зображення при наведенні */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* 2. РОЗМІРИ: Випливають знизу ТІЛЬКИ ПРИ НАВЕДЕННІ (Hover Overlay) */}
        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full p-3 transition-transform duration-300 ease-out group-hover:translate-y-0">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Доступні розміри:
            </p>
            <div className="flex flex-wrap gap-1">
              {product.availableSizes.slice(0, 5).map((size) => (
                <span
                  key={size}
                  className="rounded-md border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white backdrop-blur-md"
                >
                  {size}
                </span>
              ))}
              {product.availableSizes.length > 5 && (
                <span className="rounded-md bg-[#950740]/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                  +{product.availableSizes.length - 5}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. ІНФОРМАЦІЙНИЙ БЛОК */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="line-clamp-2 text-xs font-bold text-gray-200 transition-colors group-hover:text-white">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[#6F2232]/20 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-gray-500">Ціна</span>
            <span className="text-sm font-black text-white">
              {formattedPrice} <span className="text-[11px] font-normal text-[#C3073F]">грн</span>
            </span>
          </div>

          {/* Лаконічний індикатор замість гігантської кнопки */}
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#6F2232]/30 bg-[#1A1A1D] text-gray-400 transition-all duration-300 group-hover:border-[#950740] group-hover:bg-[#950740] group-hover:text-white">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}