// src/app/products/[id]/page.tsx
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetails from '@/components/ProductDetails';
import { getProductById } from '@/services/mydrop';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ id: string }>;
}

// Динамічний SEO-заголовок сторінки
export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) return { title: 'Товар не знайдено | BARYLUX' };

    return {
        title: `${product.name} | BARYLUX`,
        description: `Купити ${product.name} за ціною ${product.price} грн у магазині BARYLUX.`,
        openGraph: {
            images: [product.image],
        },
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { id } = await params; // 👈 Вимога Next.js 15
    const product = await getProductById(id);

    if (!product) {
        notFound(); // Повертає нативну 404 сторінку Next.js
    }

    return (
        <div className="flex min-h-screen flex-col justify-between bg-[#1A1A1D] text-white selection:bg-[#950740]">
            <div>
                <Header />

                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Link href="/products" className="mb-6 inline-block text-sm font-medium text-[#950740] transition-colors hover:text-[#C3073F]">
                        &larr; Повернутися назад
                    </Link>
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

                        {/* ЛІВА КОЛОНКА: Зображення товару */}
                        <div className="flex flex-col gap-4">
                            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[#6F2232]/30 bg-[#121214] shadow-2xl">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover object-center"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                                        Зображення відсутнє
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ПРАВА КОЛОНКА: Деталі, Розміри та Instagram CTA */}
                        <div className="rounded-3xl border border-[#6F2232]/30 bg-[#121214]/60 p-6 backdrop-blur-xl sm:p-8">
                            <ProductDetails
                                name={product.name}
                                price={product.price}
                                variants={product.variants || []}
                                instagramUsername="barylux.ua"
                            />
                        </div>

                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}