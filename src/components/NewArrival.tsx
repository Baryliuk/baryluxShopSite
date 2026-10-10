import { fetchingProducts } from "@/services/mydrop";
import ProductCard from "./ProductCard";

export default async function NewArrival() {
  const rawProducts = await fetchingProducts();

  if (!rawProducts || rawProducts.length === 0) {
    return (
      <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#1C1E24] bg-[#0E0E11] p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Каталог порожній
        </p>
      </div>
    );
  }

  // Безопасна реверсія масиву без залежності від ES2023 toReversed
  const reversedProducts = [...rawProducts].reverse();

  return (
  <section id="new-arrivals" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between border-b border-[#1C1E24] pb-4">
          <h2 className="text-xl font-black uppercase tracking-wider text-white sm:text-2xl">
            Новинки
          </h2>
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Останнє поповнення
          </span>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reversedProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.group_id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}