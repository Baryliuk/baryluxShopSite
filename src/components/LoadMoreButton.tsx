'use client';

import { useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface LoadMoreButtonProps {
  currentLimit: number;
  step?: number;
}

export default function LoadMoreButton({
  currentLimit,
  step = 9,
}: LoadMoreButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', String(currentLimit + step));

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <button
      type="button"
      onClick={handleLoadMore}
      disabled={isPending}
      aria-busy={isPending}
      className="group relative inline-flex items-center justify-center rounded-xl border border-[#262933] bg-[#121319] px-8 py-3.5 text-xs font-extrabold uppercase tracking-widest text-white shadow-lg transition-all duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-black hover:shadow-[0_0_25px_rgba(249,115,22,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent group-hover:border-black group-hover:border-t-transparent" />
          Завантаження...
        </span>
      ) : (
        'Завантажити ще'
      )}
    </button>
  );
}