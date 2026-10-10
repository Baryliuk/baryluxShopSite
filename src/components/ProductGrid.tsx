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
  const rawProducts: ProductItem[] = await fetchingProducts();

  if (!rawProducts || rawProducts.length === 0) {
    return (
      <div className="flex min-h-[350px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#1C1E24] bg-[#0E0E11] p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Каталог порожній
        </p>
      </div>
    );
  }

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

  if (query) {
    const normalizedQuery = query.trim().toLowerCase();
    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(normalizedQuery)
    );
  }

  if (size) {
    const selectedSize = size.trim().toUpperCase();
    filtered = filtered.filter((product) =>
      product.availableSizes.includes(selectedSize)
    );
  }

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

  const reversedProducts = [...filtered].reverse();
  const displayedProducts = reversedProducts.slice(0, currentLimit);
  const hasMore = reversedProducts.length > currentLimit;

  if (reversedProducts.length === 0) {
    return (
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#1C1E24] bg-[#0E0E11] p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Товарів не знайдено
        </p>
        <p className="mt-1 text-[11px] text-zinc-500">
          Спробуйте скинути фільтри або обрати інший розмір.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedProducts.map((product, index) => (
          <ProductCard
            key={product.group_id}
            product={product}
            priority={index < 3}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <LoadMoreButton currentLimit={currentLimit} step={9} />
        </div>
      )}
    </div>
  );
}