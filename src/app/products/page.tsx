import ProductGrid from '@/components/ProductGrid';
import FiltersSidebar from '@/components/FiltersSidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import { fetchingProducts } from '@/services/mydrop';
import { extractUniqueSizes } from '@/utils/sizes';

interface PageProps {
    searchParams: Promise<{
        query?: string;
        size?: string;
        limit?: string;
    }>;
}


export default async function ProductsPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;

    // 1. Завантажуємо всі товари з фіду MyDrop
  const allProducts = await fetchingProducts();

  // 2. Динамічно дістаємо тільки ті розміри, які є в базі
  const availableSizes = extractUniqueSizes(allProducts);

    const query = resolvedParams.query;
    const size = resolvedParams.size;
    const limit = resolvedParams.limit;

    return (
        <div className="bg-[#1a1a1d]">
            <Header />
            <div className='flex mx-auto max-w-7xl p-4 '>
                <SearchBar />
            </div>
            <div className="flex gap-8 max-w-7xl mx-auto p-4">
                <aside className="w-1/4"><FiltersSidebar sizes={availableSizes} currentSize={resolvedParams.size} /></aside>
                <main className="w-3/4">
                    <ProductGrid query={query} size={size} limit={limit} />
                </main>
            </div>
            <Footer />
        </div>
    );
}