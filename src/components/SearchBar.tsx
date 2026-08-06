'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Локальний стейт для миттєвого відображення літер в інпуті
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') || '');
  const [isPending, startTransition] = useTransition();

  // Зберігаємо посилання на таймер
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Синхронізуємо інпут з URL при зовнішніх змінах
  const urlQuery = searchParams.get('query') || '';
  useEffect(() => {
    setSearchTerm(urlQuery);
  }, [urlQuery]);

  // Очищаємо таймер при демонтажі компонента
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set('query', value.trim());
      } else {
        params.delete('query');
      }
      params.delete('limit');

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 300);
  };

  // Кнопка швидкого скидання інпуту
  const handleClear = () => {
    setSearchTerm('');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('query');
    params.delete('limit');

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const isSearching = searchTerm !== (searchParams.get('query') || '') || isPending;

  return (
    <div className="relative mb-6 w-full">
      {/* Іконка лупи */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#4E4E50]">
        <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Інпут */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Пошук одягу (худі, футболки)..."
        className="w-full rounded-xl border border-[#6F2232]/40 bg-[#121214] py-3 pl-11 pr-12 text-sm text-white placeholder-[#4E4E50] outline-none transition-all duration-300 focus:border-[#950740] focus:shadow-[0_0_15px_rgba(149,7,64,0.3)]"
      />

      {/* Індикатор завантаження та кнопка очищення */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 gap-2">
        {isSearching && (
          <span className="h-2 w-2 rounded-full bg-[#C3073F] animate-ping" title="Шукаємо..." />
        )}

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[#4E4E50] hover:text-white transition-colors p-1"
            aria-label="Очистити пошук"
          >
            <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}