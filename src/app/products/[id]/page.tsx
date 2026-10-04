import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetails from '@/components/ProductDetails';
import { getProductById } from '@/services/mydrop';

interface PageProps {
  params: Promise<{ id: string }>;
}

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
  const { id } = await params; // Next.js 15 Async Params
  const product = await getProductById(id);

  if (!product) {
    notFound(); // Нативна 404 сторінка Next.js
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0D0E12] text-zinc-100 selection:bg-orange-500 selection:text-black">
      <div>
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 transition-colors hover:text-orange-500"
          >
            &larr; Повернутися до каталогу
          </Link>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            {/* ЛІВА КОЛОНКА: Зображення товару */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[#262933] bg-[#121319] shadow-2xl">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-600">
                    Зображення відсутнє
                  </div>
                )}
              </div>
            </div>

            {/* ПРАВА КОЛОНКА: Деталі, Розміри та Instagram CTA */}
            <div className="rounded-3xl border border-[#262933] bg-[#121319]/80 p-6 backdrop-blur-xl sm:p-8">
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