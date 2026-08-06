import Image from 'next/image';
import Link from 'next/link';
import { fetchingProducts } from '@/services/mydrop';
import LoadMoreButton from '@/components/LoadMoreButton';

interface ProductGridProps {
    query?: string;
    size?: string;
    limit?: string;
}

export interface Variant {
    id: string;
    size: string;
    stock: boolean;
}

export interface ProductItem {
    group_id: string;
    category_id?: string;
    category_name?: string;
    name: string;
    price: number;
    image: string;
    variants: Variant[];
    availableSizes?: string[];
}

// Еталонний порядок розмірів для правильного сортування
const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];

export default async function ProductGrid({ query, size, limit }: ProductGridProps) {
    const currentLimit = Number(limit) || 9;

    const rawProducts: ProductItem[] = await fetchingProducts();
    if (!rawProducts || rawProducts.length === 0) {
        return (
            <div className="w-full py-16 text-center text-sm font-medium tracking-wider text-[#4E4E50]">
                Товари не знайдені.
            </div>
        );
    }

    // 1. Нормалізація даних: витягуємо доступні розміри з вкладеного масиву variants
    const normalizedProducts = rawProducts.map((product) => {
        const availableSizes = Array.from(
            new Set(
                (product.variants || [])
                    .filter((v) => v.stock)
                    .map((v) => (v.size !== null && v.size !== undefined ? String(v.size).trim().toUpperCase() : ''))
                    .filter(Boolean)
            )
        ).sort((a, b) => {
            const indexA = SIZE_ORDER.indexOf(a);
            const indexB = SIZE_ORDER.indexOf(b);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });

        return {
            ...product,
            availableSizes,
        };
    });

    // 2. Фільтрація по пошуковому запиту
    let filtered = normalizedProducts;
    if (query) {
        const normalizedQuery = query.trim().toLowerCase();
        filtered = normalizedProducts.filter((product) =>
            product.name.toLowerCase().includes(normalizedQuery)
        );
    }

    // 3. Фільтрація за вибраним розміром
    if (size) {
        const selectedSize = size.trim().toUpperCase();
        filtered = filtered.filter((product) =>
            product.availableSizes.includes(selectedSize)
        );
    }

    const reversedProducts = filtered.toReversed();
    const displayedProducts = reversedProducts.slice(0, currentLimit);
    const hasMore = reversedProducts.length > currentLimit;

    if (reversedProducts.length === 0) {
        return (
            <div className="w-full py-16 text-center text-sm font-medium tracking-wider text-[#4E4E50]">
                Немає товарів із вибраними фільтрами.
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-10">
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayedProducts.map((product, index) => (
                    <div
                        key={product.group_id}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#6F2232]/30 bg-[#1A1A1D] p-4 transition-all duration-300 hover:border-[#950740] hover:shadow-[0_0_25px_rgba(149,7,64,0.25)]"
                    >
                        {/* Контейнер для фото */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#121214]">

                            {/* Плашки розмірів поверх зображення */}
                            {product.availableSizes.length > 0 && (
                                <div className="absolute top-3 left-3 z-10 flex max-w-[85%] flex-wrap gap-1 pointer-events-none">
                                    {product.availableSizes.map((s) => (
                                        <span
                                            key={s}
                                            className="rounded border border-[#6F2232]/60 bg-[#121214]/80 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur-md shadow-sm"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <Image
                                src={product.image}
                                alt={product.name}
                                priority={index < 4}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        {/* Інформація про товар */}
                        <div className="mt-4 flex flex-grow flex-col justify-between">
                            <h3 className="min-h-[40px] text-sm font-semibold tracking-wide text-white transition-colors group-hover:text-[#C3073F] line-clamp-2">
                                {product.name}
                            </h3>
                        </div>

                        {/* Ціна та кнопка переходу */}
                        <div className="mt-5 flex items-center justify-between border-t border-[#6F2232]/20 pt-4">
                            <span className="text-lg font-bold tracking-wide text-white">
                                {product.price} <span className="text-xs font-normal text-[#950740]">грн</span>
                            </span>

                            <Link
                                href={`/products/${product.group_id}`}
                                className="rounded-xl bg-[#950740] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#C3073F] hover:shadow-[0_0_15px_rgba(195,7,63,0.5)]"
                            >
                                Дивитись
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && <LoadMoreButton currentLimit={currentLimit} />}
        </div>
    );
}