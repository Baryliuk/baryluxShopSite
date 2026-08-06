// src/app/products/page.tsx (або landing page)
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
    <div className="min-h-screen bg-[#1A1A1D] text-white flex flex-col justify-between selection:bg-[#950740]">
      <div>
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <SearchBar />
          </div>

          {/* Лейаут: Сайдбар + Основна сітка */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <FiltersSidebar
              sizes={availableSizes}
              categories={availableCategories}
              currentSize={resolvedParams.size}
              currentCategory={resolvedParams.category}
            />

            <div className="flex-1 w-full min-w-0">
              <ProductGrid
                query={resolvedParams.query}
                size={resolvedParams.size}
                category={resolvedParams.category}
                limit={resolvedParams.limit}
              />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}