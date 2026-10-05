import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import FiltersSidebar from "@/components/FiltersSidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import { fetchingProducts } from "@/services/mydrop";
import { extractUniqueSizes } from "@/utils/sizes";
import { extractUniqueCategories } from "@/utils/categories";

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

  // Паралельно фетчимо каталог для фільтрів (завдяки React cache у mydrop.ts це 0 затримок)
  const allProducts = await fetchingProducts();
  const availableSizes = extractUniqueSizes(allProducts);
  const availableCategories = extractUniqueCategories(allProducts);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0D0E12] text-zinc-100 selection:bg-orange-500 selection:text-black">
      <div>
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Suspense
              fallback={
                <div className="h-11 w-full animate-pulse rounded-xl border border-[#262933] bg-[#121319]" />
              }
            >
              <SearchBar />
            </Suspense>
          </div>

          {/* Лейаут: Сайдбар + Основна сітка */}
          <div className="flex flex-col items-start gap-8 md:flex-row">
            <FiltersSidebar
              sizes={availableSizes}
              categories={availableCategories}
              currentSize={resolvedParams.size}
              currentCategory={resolvedParams.category}
            />

            <div className="w-full min-w-0 flex-1">
              <Suspense
                key={JSON.stringify(resolvedParams)}
                fallback={
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-80 w-full animate-pulse rounded-2xl border border-[#262933] bg-[#121319]"
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
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}