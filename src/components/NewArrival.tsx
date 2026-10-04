import { fetchingProducts } from "@/services/mydrop";
import { ProductItem } from "./ProductGrid";
import ProductCard from "./ProductCard";

export default async function NewArrival() {

    const rawProducts: ProductItem[] = await fetchingProducts();
    if (!rawProducts || rawProducts.length === 0) {
        return (
            <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#262933] bg-[#121319]/60 p-8 text-center backdrop-blur-sm">
                <p className="text-sm font-semibold text-zinc-400">Каталог порожній.</p>
            </div>
        );
    }
      const reversedProducts = rawProducts.toReversed();
    return (
        <div className="bg-[#0D0E12] py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-white">Новинки 🌟</h2>
                <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {reversedProducts.slice(0, 6).map((product) => (
                        <ProductCard key={product.group_id} product={product} />
                    ))}
                </div>  
            </div>
        </div>
    );
}