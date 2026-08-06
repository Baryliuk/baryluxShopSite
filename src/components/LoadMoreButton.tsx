'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function LoadMoreButton({ currentLimit }: { currentLimit: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Ініціалізуємо перехід для відстеження стану серверного рендеру
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', String(currentLimit + 9));

    // Огортаємо мутацію URL в startTransition
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <button
      onClick={handleLoadMore}
      disabled={isPending}
      className="mx-auto px-8 py-3 border border-black text-base uppercase font-medium hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Завантаження...' : 'Показати ще'}
    </button>
  );
}