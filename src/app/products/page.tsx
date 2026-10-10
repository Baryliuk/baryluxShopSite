import { Suspense } from 'react';
import ProductGrid from '@/components/ProductGrid';
import FiltersSidebar from '@/components/FiltersSidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { fetchingProducts } from '@/services/mydrop';
import { extractUniqueSizes } from '@/utils/sizes';
import { extractUniqueCategories } from '@/utils/categories';

interface PageProps {
  searchParams: Promise<{
    query?: string;
    size?: string;
    category?: string;
    limit?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const allProducts = await fetchingProducts();
  const availableSizes = extractUniqueSizes(allProducts);
  const availableCategories = extractUniqueCategories(allProducts);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0A0A0C] text-zinc-100 selection:bg-white selection:text-black">
      <div>
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          
          {/* Верхня консоль: Заголовок + Пошук у 1 рядок на десктопі */}
          <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[#1C1E24] pb-8 md:flex-row md:items-end">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                Колекція 2026
              </span>
              <h1 className="mt-1 text-3xl font-black uppercase tracking-tight sm:text-4xl">
                Каталог
              </h1>
            </div>

            <div className="w-full md:w-80">
              <Suspense
                fallback={
                  <div className="h-11 w-full animate-pulse rounded-xl border border-[#1C1E24] bg-[#0E0E11]" />
                }
              >
                <SearchBar />
              </Suspense>
            </div>
          </div>

          {/* Архітектура Лейауту: Sticky Sidebar (250px) + Main Grid */}
          <div className="flex flex-col items-start gap-10 md:flex-row">
            
            {/* Sticky Сайдбар Фільтрів */}
            <aside className="sticky top-28 w-full shrink-0 md:w-64">
              <FiltersSidebar
                sizes={availableSizes}
                categories={availableCategories}
                currentSize={resolvedParams.size}
                currentCategory={resolvedParams.category}
              />
            </aside>

            {/* Основна сітка каталогу */}
            <section className="w-full min-w-0 flex-1">
              <Suspense
                key={JSON.stringify(resolvedParams)}
                fallback={
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[3/4] w-full animate-pulse border border-[#1C1E24] bg-[#0E0E11]"
                      />
                    ))}
                  </div>
                }
              >
                <ProductGrid
                  query={resolvedParams.query}
                  size={resolvedParams.size}
                  category={resolvedParams.category}
                  limit={resolvedParams.limit}
                />
              </Suspense>
            </section>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}