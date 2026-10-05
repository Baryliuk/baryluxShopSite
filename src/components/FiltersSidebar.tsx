'use client';

import { useState, useEffect, useTransition } from 'react';
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

  // Блокування скролу сторінки, коли відкрита мобільна шторка
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

    if (params.get(key)?.toUpperCase() === value.toUpperCase()) {
      params.delete(key);
    } else {
      params.set(key, value);
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

  const Content = (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between border-b border-[#262933] pb-4">
        <span className="text-xs font-black uppercase tracking-widest text-white">
          Фільтри {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </span>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            disabled={isPending}
            className="text-[11px] font-semibold text-orange-500 hover:text-orange-400 transition-colors disabled:opacity-50"
          >
            Скинути все
          </button>
        )}
      </div>

      {categories.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
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
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-orange-500 text-black font-extrabold shadow-[0_0_15px_rgba(249,115,22,0.3)] border border-orange-400'
                      : 'text-zinc-300 hover:bg-[#1A1C23] hover:text-white border border-transparent'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="flex flex-col gap-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
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
                  className={`flex h-9 items-center justify-center rounded-lg border px-1 text-[11px] font-extrabold uppercase transition-all duration-200 overflow-hidden ${
                    isActive
                      ? 'border-orange-400 bg-orange-500 text-black shadow-[0_0_12px_rgba(249,115,22,0.35)]'
                      : 'border-[#262933] bg-[#0D0E12]/80 text-zinc-400 hover:border-orange-500/50 hover:text-white'
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
      <div className="md:hidden w-full mb-4">
        <button
          type="button"
          onClick={() => setIsOpenMobile(true)}
          className="w-full flex items-center justify-between rounded-xl border border-[#262933] bg-[#121319] px-4 py-3 text-xs font-bold uppercase text-white shadow-lg hover:border-orange-500/40"
        >
          <span>Фільтри та категорії</span>
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-orange-500 text-black px-2 py-0.5 text-[10px] font-extrabold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      <aside
        className={`hidden md:block w-64 shrink-0 transition-opacity duration-200 ${
          isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="sticky top-24 rounded-2xl border border-[#262933] bg-[#121319]/90 p-5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {Content}
        </div>
      </aside>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="ml-auto h-full w-4/5 max-w-xs bg-[#121319] border-l border-[#262933] p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-black uppercase text-white">Каталог</span>
                <button
                  type="button"
                  onClick={() => setIsOpenMobile(false)}
                  className="text-zinc-400 hover:text-white text-lg p-1"
                >
                  ✕
                </button>
              </div>
              {Content}
            </div>

            <button
              type="button"
              onClick={() => setIsOpenMobile(false)}
              className="mt-6 w-full rounded-xl bg-orange-500 py-3 text-xs font-extrabold uppercase text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:bg-orange-400 transition-colors"
            >
              Застосувати
            </button>
          </div>
        </div>
      )}
    </>
  );
}