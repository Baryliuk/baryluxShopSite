import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#262933] bg-[#0D0E12]/80 backdrop-blur-md transition-all text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Логотип */}
        <Link 
          href="/" 
          className="group font-sans text-xl font-black tracking-wider text-white transition-colors"
        >
          <span className="text-orange-500 transition-colors group-hover:text-white">[</span>
          <span className="px-1 text-white">BARYLUX</span>
          <span className="text-orange-500 transition-colors group-hover:text-white">]</span>
        </Link>

        {/* Навігація та іконки */}
        <div className="flex items-center gap-5">
          {/* Особистий Кабінет */}
          <Link
            href="/profile"
            className="text-zinc-400 transition-colors hover:text-orange-500"
            aria-label="Особистий кабінет"
          >
            <svg
              className="h-6 w-6 stroke-current fill-none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Кошик */}
          <Link
            href="/cart"
            className="relative text-zinc-400 transition-colors hover:text-orange-500"
            aria-label="Кошик"
          >
            <svg
              className="h-6 w-6 stroke-current fill-none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {/* Бедж кількості товарів (опціонально) */}
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-black">
              0
            </span>
          </Link>
        </div>

      </div>
    </header>
  );
}