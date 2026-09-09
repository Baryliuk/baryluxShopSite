// src/components/ProductGrid.tsx
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
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#6F2232]/30 bg-[#121214]/50 p-8 text-center">
        <p className="text-sm font-medium text-gray-400">Каталог порожній.</p>
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
            let s = String(v.size ?? '').trim().toUpperCase();
            return s.includes('(') ? s.split('(')[0].trim() : s;
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

  // 4. Фільтр: Категорія (перевірка основного ID та масиву суміжних ID)
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

  // 5. Сортування (нові зверху) та Пагінація
  const reversedProducts = filtered.toReversed();
  const displayedProducts = reversedProducts.slice(0, currentLimit);
  const hasMore = reversedProducts.length > currentLimit;

  // Порожній стан при відсутності збігів по фільтрах
  if (reversedProducts.length === 0) {
    return (
      <div className="flex min-h-[350px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#6F2232]/30 bg-[#121214]/40 p-8 text-center backdrop-blur-sm">
        <p className="text-sm font-bold text-gray-300">
          За вашим запитом товарів не знайдено
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Спробуйте вибрати інший розмір або скинути категорію.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-10">
      {/* 🚀 Адаптивна преміальна сітка: 1 колонка на мобілках, 2 на планшетах, 3 на десктопі */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedProducts.map((product) => (
          <ProductCard key={product.group_id} product={product} />
        ))}
      </div>

      {/* Кнопка "Завантажити ще" (якщо є залишок) */}
     {hasMore && (
    <div className="flex justify-center pt-4">
      <LoadMoreButton currentLimit={currentLimit} step={9} />
    </div>
  )}
    </div>
  );
}