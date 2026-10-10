import { fetchingProducts, normalizeCategoryName } from "@/services/mydrop";
import FiltersSidebar from "@/components/FiltersSidebar";
import ProductGrid from "@/components/ProductGrid";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    size?: string;
    query?: string;
    limit?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category;
  const currentSize = resolvedParams.size;
  const searchQuery = resolvedParams.query;
  const limit = resolvedParams.limit;

  const allProducts = await fetchingProducts();

  // 1. Формуємо унікальні категорії для сайдбару без дублів
  const categoryMap = new Map<string, { id: string; name: string }>();
  allProducts.forEach((p) => {
    // Якщо у товарів збереглася категорія як ID або як назва, обробляємо безпечно
    const rawName = p.category_name || "Інше";
    const name = normalizeCategoryName ? normalizeCategoryName(rawName) : rawName;
    
    // Використовуємо category_id або slug назви як ключ
    const id = String(p.category_id || name.toLowerCase());
    
    if (!categoryMap.has(id)) {
      categoryMap.set(id, { id, name });
    }
  });
  const categories = Array.from(categoryMap.values());

  // 2. Фільтруємо товари за категорією для отримання контекстних розмірів
  let targetProducts = allProducts;
  if (currentCategory && currentCategory !== "all") {
    targetProducts = allProducts.filter((p) => {
      const mainCatMatch = String(p.category_id) === String(currentCategory);
      const subCatMatch = Array.isArray(p.category_ids) && p.category_ids.map(String).includes(String(currentCategory));
      const nameMatch = p.category_name?.toLowerCase() === currentCategory.toLowerCase();
      return mainCatMatch || subCatMatch || nameMatch;
    });
  }

  // 3. Збираємо контекстні розміри ТІЛЬКИ для обраної категорії (з захистом від не-строкових значень)
  const sizesSet = new Set<string>();
  targetProducts.forEach((p) => {
    p.variants?.forEach((v) => {
      if (v.stock && v.size !== undefined && v.size !== null) {
        const s = String(v.size).trim().toUpperCase();
        const cleanSize = s.includes('(') ? s.split('(')[0]?.trim() || s : s;
        if (cleanSize) sizesSet.add(cleanSize);
      }
    });
  });
  const sizes = Array.from(sizesSet).sort();

  // Знаходимо гарну назву категорії для заголовка сторінки
  let displayCategoryName = "Усі товари";
  if (currentCategory) {
    const foundCat = categories.find((c) => c.id === currentCategory || c.name.toLowerCase() === currentCategory.toLowerCase());
    if (foundCat) displayCategoryName = foundCat.name;
    else displayCategoryName = currentCategory;
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0A0A0C] text-zinc-100">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-[#1C1E24] pb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            [ CATALOG ]
          </span>
          <h1 className="mt-1 text-2xl font-black uppercase text-white">
            {displayCategoryName}
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          {/* Сайдбар фільтрів отримує тільки чисті категорії та контекстні розміри */}
          <FiltersSidebar
            categories={categories}
            sizes={sizes}
            currentCategory={currentCategory}
            currentSize={currentSize}
          />

          {/* ProductGrid сам робить всю логіку фільтрації та пагінації за URL-параметрами */}
          <section>
            <ProductGrid
              category={currentCategory}
              size={currentSize}
              query={searchQuery}
              limit={limit}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}