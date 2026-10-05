import ProductCard from './ProductCard';
import { fetchingProducts } from '@/services/mydrop';
import LoadMoreButton from './LoadMoreButton';

export interface Variant {
  id: string;
  size: string | number;
  stock: boolean;
}

export interface ProductItem {
  group_id: string;
  name: string;
  price: number;
  image: string;
  category_id?: string | number;
  category_ids?: (string | number)[];
  variants: Variant[];
  availableSizes?: string[];
}

interface ProductGridProps {
  query?: string;
  size?: string;
  category?: string;
  limit?: string;
}

export default async function ProductGrid({
  query,
  size,
  category,
  limit,
}: ProductGridProps) {
  const currentLimit = Number(limit) || 6;

  // Отримуємо дані з API MyDrop
  const rawProducts: ProductItem[] = await fetchingProducts();

  if (!rawProducts || rawProducts.length === 0) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#262933] bg-[#121319]/60 p-8 text-center backdrop-blur-sm">
        <p className="text-sm font-semibold text-zinc-400">Каталог порожній.</p>
      </div>
    );
  }

  // 1. Нормалізація розмірів усередині кожного товару
  let filtered = rawProducts.map((product) => {
    const availableSizes = Array.from(
      new Set(
        (product.variants || [])
          .filter((v) => v.stock)
          .map((v) => {
            const s = String(v.size ?? '').trim().toUpperCase();
            return s.includes('(') ? s.split('(')[0]?.trim() ?? s : s;
          })
          .filter(Boolean)
      )
    );

    return {
      ...product,
      availableSizes,
    };
  });

  // 2. Фільтр: Пошуковий запит
  if (query) {
    const normalizedQuery = query.trim().toLowerCase();
    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery)
    );
  }

  // 3. Фільтр: Розмір
  if (size) {
    const selectedSize = size.trim().toUpperCase();
    filtered = filtered.filter((product) =>
      product.availableSizes.includes(selectedSize)
    );
  }

  // 4. Фільтр: Категорія
  if (category) {
    const catIdStr = String(category);
    filtered = filtered.filter((product) => {
      const mainCatMatch = String(product.category_id ?? '') === catIdStr;
      const subCatMatch =
        Array.isArray(product.category_ids) &&
        product.category_ids.map(String).includes(catIdStr);

      return mainCatMatch || subCatMatch;
    });
  }

  // 5. Безопасна реверсія масиву без залежності від ES2023 toReversed
  const reversedProducts = [...filtered].reverse();
  const displayedProducts = reversedProducts.slice(0, currentLimit);
  const hasMore = reversedProducts.length > currentLimit;

  // Порожній стан при відсутності збігів по фільтрах
  if (reversedProducts.length === 0) {
    return (
      <div className="flex min-h-[350px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#262933] bg-[#121319]/40 p-8 text-center backdrop-blur-sm">
        <p className="text-sm font-bold text-zinc-200">
          За вашим запитом товарів не знайдено
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          Спробуйте вибрати інший розмір або скинути категорію.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-10">
      {/* Адаптивна сітка каталогу */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedProducts.map((product, index) => (
          <ProductCard
            key={product.group_id}
            product={product}
            priority={index < 3} // Перші 3 картки завантажуються з пріоритетом для кращого LCP
          />
        ))}
      </div>

      {/* Кнопка "Завантажити ще" */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <LoadMoreButton currentLimit={currentLimit} step={9} />
        </div>
      )}
    </div>
  );
}