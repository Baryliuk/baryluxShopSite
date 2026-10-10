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
      className="group inline-flex items-center justify-center rounded-xl border border-[#1C1E24] bg-[#0E0E11] px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-300 transition-all duration-200 hover:border-white hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent group-hover:border-black group-hover:border-t-transparent" />
          Завантаження...
        </span>
      ) : (
        'Завантажити ще'
      )}
    </button>
  );
}