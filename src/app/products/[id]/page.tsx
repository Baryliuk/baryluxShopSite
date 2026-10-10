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
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0A0A0C] text-zinc-100 selection:bg-white selection:text-black">
      <div>
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Навігація / Breadcrumbs (Мінімалістична строга лінія) */}
          <div className="mb-8 flex items-center gap-2 text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
            <Link
              href="/products"
              className="transition-colors hover:text-white"
            >
              Каталог
            </Link>
            <span>/</span>
            <span className="truncate text-zinc-300">{product.name}</span>
          </div>

          {/* 2-Колонковий Асиметричний Лейаут: 58% Галерея / 42% Sticky Деталі */}
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
            
            {/* ЛІВА КОЛОНКА (58%): Фотогалерея */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0E0E11]">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-mono text-zinc-600">
                    [ NO IMAGE AVAILABLE ]
                  </div>
                )}
              </div>
            </div>

            {/* ПРАВА КОЛОНКА (42%): Sticky Купівля (Залишається у фокусі при скролі) */}
            <div className="sticky top-28 lg:col-span-5">
              <ProductDetails
                groupId={product.group_id}
                name={product.name}
                price={product.price}
                image={product.image}
                variants={product.variants}
              />
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}