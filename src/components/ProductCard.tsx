import Link from 'next/link';
import Image from 'next/image';
import { ProductItem } from './ProductGrid';

interface ProductCardProps {
  product: ProductItem;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  // Безпечне форматування ціни від крашу
  const formattedPrice = typeof product?.price === 'number' && !isNaN(product.price)
    ? new Intl.NumberFormat('uk-UA').format(product.price)
    : '0';

  const href = product?.group_id ? `/products/${product.group_id}` : '#';

  return (
    <Link
      href={href}
      className="group block w-full text-left"
    >
      {/* 1. ФОТО ТОВАРУ (Співвідношення 4:5, чисті кути, м'який ховер) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#0E0E11] border border-[#1C1E24]/60 transition-colors duration-300 group-hover:border-[#333]">
        {product?.image ? (
          <Image
            src={product.image}
            alt={product.name || 'Товар'}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-zinc-600">
            НЕМАЄ ФОТО
          </div>
        )}

        {/* 2. РОЗМІРИ: М'який чистий оверлей у кутку при ховері */}
        {product?.availableSizes && product.availableSizes.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {product.availableSizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="rounded border border-white/20 bg-black/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md"
              >
                {size}
              </span>
            ))}
            {product.availableSizes.length > 4 && (
              <span className="rounded border border-white/20 bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-zinc-300 backdrop-blur-md">
                +{product.availableSizes.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 3. ТЕКСТОВИЙ БЛОК (Мінімалізм без рамок) */}
      <div className="mt-2.5 px-0.5">
        <h3 className="line-clamp-1 text-xs font-medium tracking-tight text-zinc-200 transition-colors group-hover:text-white">
          {product?.name || 'Без назви'}
        </h3>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-extrabold tracking-tight text-white">
            {formattedPrice} ₴
          </span>
        </div>
      </div>
    </Link>
  );
}