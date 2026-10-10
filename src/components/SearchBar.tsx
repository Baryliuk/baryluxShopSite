'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getSearchSuggestions, SearchSuggestion } from '@/app/actions/search';

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('query') || '');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const trimmed = value.trim();

    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      setIsLoading(false);

      if (trimmed.length === 0) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('query');
        params.delete('limit');
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
      return;
    }

    setIsLoading(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        const results = await getSearchSuggestions(trimmed);
        setSuggestions(results);
        setIsDropdownOpen(results.length > 0);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }

      const params = new URLSearchParams(searchParams.toString());
      params.set('query', trimmed);
      params.delete('limit');
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 400);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setIsDropdownOpen(false);
    setIsLoading(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const params = new URLSearchParams(searchParams.toString());
    params.delete('query');
    params.delete('limit');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div ref={wrapperRef} className="relative mb-8 w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500">
          <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsDropdownOpen(true);
          }}
          placeholder="Пошук каталогу..."
          className="w-full rounded-xl border border-[#1C1E24] bg-[#0E0E11] py-3.5 pl-11 pr-12 text-xs text-white placeholder-zinc-500 outline-none transition-all duration-200 focus:border-zinc-400"
        />

        <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-4">
          {isLoading && (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}

          {searchTerm && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-zinc-500 transition-colors hover:text-white"
              aria-label="Очистити пошук"
            >
              <svg className="h-3.5 w-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Список підказок */}
      {isDropdownOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[#1C1E24] bg-[#0E0E11] p-2 shadow-2xl backdrop-blur-xl">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            Знайдено ({suggestions.length})
          </div>
          <div className="flex flex-col gap-1">
            {suggestions.map((item) => (
              <Link
                key={item.group_id}
                href={`/products/${item.group_id}`}
                onClick={() => setIsDropdownOpen(false)}
                className="group flex items-center gap-3 rounded-lg p-2 transition hover:bg-[#16181F]"
              >
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-[#16181F]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="44px"
                      className="object-cover object-center group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] text-zinc-600">
                      N/A
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">
                  <span className="truncate text-xs font-semibold text-zinc-200 group-hover:text-white">
                    {item.name}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {new Intl.NumberFormat('uk-UA').format(item.price)} грн
                  </span>
                </div>

                <span className="pr-2 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-white">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}