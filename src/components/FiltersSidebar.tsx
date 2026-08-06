'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface FiltersSidebarProps {
  sizes: string[]; // Динамічний масив з сервера
  currentSize?: string;
}

export default function FiltersSidebar({ sizes, currentSize }: FiltersSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSizeClick = (size: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Якщо клікнули на вже активний розмір — скидаємо його
    if (currentSize?.toUpperCase() === size.toUpperCase()) {
      params.delete('size');
    } else {
      params.set('size', size);
    }

    // Зміна фільтру завжди скидає пагінацію
    params.delete('limit');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearSizeFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('size');
    params.delete('limit');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="flex flex-col gap-3.5 w-full select-none">
      {/* Шапка фільтра */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white">
          Розмір
        </h3>
        {currentSize && (
          <button
            type="button"
            onClick={clearSizeFilter}
            disabled={isPending}
            className="text-[11px] font-medium text-[#4E4E50] hover:text-[#C3073F] transition-colors underline underline-offset-2"
          >
            Скинути
          </button>
        )}
      </div>

      {/* Сітка розмірів з підтримкою isPending */}
      <div 
        className={`flex flex-wrap gap-2 transition-opacity duration-200 ${
          isPending ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}
      >
        {sizes.map((size) => {
          const isActive = currentSize?.toUpperCase() === size.toUpperCase();

          return (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeClick(size)}
              className={`min-w-[42px] px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? 'border-[#C3073F] bg-[#950740] text-white shadow-[0_0_15px_rgba(195,7,63,0.4)]'
                  : 'border-[#6F2232]/40 bg-[#121214] text-[#4E4E50] hover:border-[#950740] hover:text-white'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}