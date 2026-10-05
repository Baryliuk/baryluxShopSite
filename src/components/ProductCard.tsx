import Link from 'next/link';
import Image from 'next/image';
import { ProductItem } from './ProductGrid';

interface ProductCardProps {
  product: ProductItem;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('uk-UA').format(product.price);

  return (
    <Link
      href={`/products/${product.group_id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#262933] bg-[#121319] transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-[0_10px_30px_rgba(249,115,22,0.1)]"
    >
      {/* 1. КОНТЕЙНЕР ДЛЯ ЗОБРАЖЕННЯ */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#1A1C23]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-zinc-600">
            Немає фото
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* 2. РОЗМІРИ: Hover Overlay */}
        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full p-3 transition-transform duration-300 ease-out group-hover:translate-y-0">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
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
                <span className="rounded-md bg-orange-500/90 px-1.5 py-0.5 text-[10px] font-extrabold text-black backdrop-blur-md">
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
          <h3 className="line-clamp-2 text-xs font-bold text-zinc-200 transition-colors group-hover:text-white">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-[#262933] pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">Ціна</span>
            <span className="text-sm font-black text-white">
              {formattedPrice} <span className="text-[11px] font-bold text-orange-500">грн</span>
            </span>
          </div>

          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#262933] bg-[#1A1C23] text-zinc-400 transition-all duration-300 group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-black">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}