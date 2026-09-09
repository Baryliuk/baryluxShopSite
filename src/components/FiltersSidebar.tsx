'use client';

import { useState, useTransition } from 'react';
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

  const activeFiltersCount = (currentSize ? 1 : 0) + (currentCategory ? 1 : 0);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (params.get(key)?.toUpperCase() === value.toUpperCase()) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete('limit'); // Скидаємо пагінацію

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

  const Content = (
    <div className="flex flex-col gap-7">
      {/* Шапка та кнопка скидання */}
      <div className="flex items-center justify-between border-b border-[#6F2232]/30 pb-4">
        <span className="text-xs font-black uppercase tracking-widest text-white">
          Фільтри {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </span>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            disabled={isPending}
            className="text-[11px] font-semibold text-[#C3073F] hover:text-white transition-colors"
          >
            Скинути все
          </button>
        )}
      </div>

      {/* КАТЕГОРІЇ */}
      {categories.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Категорії
          </h4>
          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {categories.map((cat) => {
              const isActive = currentCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateParam('category', cat.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${isActive
                      ? 'bg-[#950740] text-white font-bold shadow-[0_0_15px_rgba(149,7,64,0.4)] border border-[#C3073F]/50'
                      : 'text-gray-300 hover:bg-[#121214] hover:text-white border border-transparent'
                    }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white shadow-glow" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* РОЗМІРИ */}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Розмір
          </h4>
          {/* Компактна сітка 4 колонки */}
          <div className="grid grid-cols-4 gap-1.5">
            {sizes.map((s) => {
              const isActive = currentSize?.toUpperCase() === s.toUpperCase();
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateParam('size', s)}
                  className={`flex h-9 items-center justify-center rounded-lg border px-1 text-[11px] font-extrabold uppercase transition-all duration-200 overflow-hidden ${isActive
                      ? 'border-[#C3073F] bg-[#950740] text-white shadow-[0_0_12px_rgba(195,7,63,0.5)]'
                      : 'border-[#6F2232]/40 bg-[#121214]/80 text-gray-300 hover:border-[#950740] hover:text-white'
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
      {/* Кнопка відкриття для мобілок (показується тільки на екранах < md) */}
      <div className="md:hidden w-full mb-4">
        <button
          type="button"
          onClick={() => setIsOpenMobile(true)}
          className="w-full flex items-center justify-between rounded-xl border border-[#6F2232]/50 bg-[#1A1A1D] px-4 py-3 text-xs font-bold uppercase text-white shadow-lg"
        >
          <span>Фільтри та категорії</span>
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-[#950740] px-2 py-0.5 text-[10px]">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* DESKTOP SIDEBAR (Sticky Glassmorphic Panel) */}
      <aside className={`hidden md:block w-64 shrink-0 transition-opacity duration-200 ${isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <div className="sticky top-24 rounded-2xl border border-[#6F2232]/40 bg-[#1A1A1D]/80 p-5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {Content}
        </div>
      </aside>

      {/* MOBILE DRAWER (Висувна панель знизу/збоку) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="ml-auto h-full w-4/5 max-w-xs bg-[#1A1A1D] border-l border-[#6F2232]/50 p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-black uppercase text-white">Каталог</span>
                <button
                  type="button"
                  onClick={() => setIsOpenMobile(false)}
                  className="text-gray-400 hover:text-white text-lg p-1"
                >
                  ✕
                </button>
              </div>
              {Content}
            </div>

            <button
              type="button"
              onClick={() => setIsOpenMobile(false)}
              className="mt-6 w-full rounded-xl bg-[#950740] py-3 text-xs font-bold uppercase text-white shadow-lg"
            >
              Застосувати
            </button>
          </div>
        </div>
      )}
    </>
  );
}