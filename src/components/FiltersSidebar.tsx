'use client';

import { useState, useEffect, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Category } from '@/utils/categories';

interface FiltersSidebarProps {
  sizes?: string[];
  categories?: Category[];
  currentSize?: string;
  currentCategory?: string;
}

export default function FiltersSidebar({
  sizes = [],
  categories = [],
  currentSize,
  currentCategory,
}: FiltersSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const activeFiltersCount = (currentSize ? 1 : 0) + (currentCategory ? 1 : 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpenMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpenMobile]);

const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (key === 'category') {
      // Якщо клікають на категорію:
      // 1. Завжди скидаємо вибраний розмір, бо сітка розмірів міняється
      params.delete('size');

      // 2. Перемикаємо або знімаємо саму категорію
      if (params.get(key)?.toUpperCase() === value.toUpperCase()) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    } else {
      // Для інших фільтрів (наприклад, розміру) стандартна логіка перемикання
      if (params.get(key)?.toUpperCase() === value.toUpperCase()) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    params.delete('limit');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('size');
    params.delete('category');
    params.delete('limit');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Контент фільтрів БЕЗ дублюючого внутрішнього заголовка
  const Content = (
    <div className="flex flex-col gap-6">
      {/* Список Категорій */}
      {categories.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Категорії
          </h4>
          {/* Фікс скролбару: створюємо акуратну темно-сіру смугу */}
          <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {categories.map((cat) => {
              const isActive = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateParam('category', cat.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-white text-black font-bold'
                      : 'text-zinc-400 hover:bg-[#14151a] hover:text-white'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Список Розмірів */}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Розмір
          </h4>
          <div className="grid grid-cols-4 gap-1.5">
            {sizes.map((s) => {
              const isActive = currentSize?.toUpperCase() === s.toUpperCase();
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateParam('size', s)}
                  className={`flex h-9 items-center justify-center rounded-lg border text-[11px] font-bold uppercase transition-all ${
                    isActive
                      ? 'border-white bg-white text-black'
                      : 'border-[#1C1E24] bg-[#0E0E11] text-zinc-400 hover:border-zinc-500 hover:text-white'
                  }`}
                >
                  <span className="truncate max-w-full">{s}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Кнопка відкриття на мобілці */}
      <div className="md:hidden w-full mb-6">
        <button
          type="button"
          onClick={() => setIsOpenMobile(true)}
          className="w-full flex items-center justify-between rounded-xl border border-[#1C1E24] bg-[#0E0E11] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:border-zinc-500 transition-colors"
        >
          <span>Фільтри та категорії</span>
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-white text-black px-2 py-0.5 text-[10px] font-extrabold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Десктопний Сайдбар */}
      <aside
        className={`hidden md:block w-60 shrink-0 transition-opacity duration-200 ${
          isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="sticky top-28 rounded-2xl border border-[#1C1E24] bg-[#0E0E11]/90 p-5 backdrop-blur-md flex flex-col gap-5">
          {/* ЄДИНИЙ Заголовок для Десктопу */}
          <div className="flex items-center justify-between border-b border-[#1C1E24] pb-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Фільтри {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </span>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                disabled={isPending}
                className="text-[11px] font-medium text-zinc-400 hover:text-white transition-colors disabled:opacity-50 underline underline-offset-4"
              >
                Скинути все
              </button>
            )}
          </div>

          {Content}
        </div>
      </aside>

      {/* Мобільний Drawer через Portal */}
      {isOpenMobile &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex md:hidden bg-black/80 backdrop-blur-md">
            <div
              className="absolute inset-0"
              onClick={() => setIsOpenMobile(false)}
            />

            <div className="relative ml-auto h-full w-4/5 max-w-xs bg-[#0A0A0C] border-l border-[#1C1E24] p-6 shadow-2xl overflow-y-auto flex flex-col justify-between z-10">
              <div>
                {/* ЄДИНИЙ Заголовок для Мобілки */}
                <div className="flex items-center justify-between mb-6 border-b border-[#1C1E24] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold uppercase tracking-wider text-white">
                      Фільтри
                    </span>
                    {activeFiltersCount > 0 && (
                      <span className="text-xs text-zinc-400">
                        ({activeFiltersCount})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {activeFiltersCount > 0 && (
                      <button
                        type="button"
                        onClick={clearAll}
                        className="text-[11px] text-zinc-400 hover:text-white underline"
                      >
                        Скинути
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsOpenMobile(false)}
                      className="text-zinc-400 hover:text-white text-lg p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {Content}
              </div>

              <button
                type="button"
                onClick={() => setIsOpenMobile(false)}
                className="mt-8 w-full rounded-xl bg-white py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-transform active:scale-[0.98]"
              >
                Застосувати
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}