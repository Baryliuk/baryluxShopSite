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

    // { scroll: false } блокує відмотку сторінки наверх
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <button
      type="button"
      onClick={handleLoadMore}
      disabled={isPending}
      className="rounded-xl border border-[#6F2232]/40 bg-[#121214] px-8 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all duration-300 hover:border-[#950740] hover:bg-[#950740] hover:shadow-[0_0_20px_rgba(149,7,64,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Завантаження...' : 'Завантажити ще'}
    </button>
  );
}