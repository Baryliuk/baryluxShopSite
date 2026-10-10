import Link from "next/link";

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1C1E24] bg-[#0A0A0C]/40 backdrop-blur-md transition-all text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Логотип */}
        <Link 
          href="/" 
          className="font-mono text-lg font-black tracking-[0.25em] text-white transition-opacity hover:opacity-80"
        >
          BARYLUX
        </Link>

        {/* Навігація та іконки */}
        <div className="flex items-center gap-6">
          {/* Каталог */}
          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-widest text-zinc-400 transition-colors hover:text-white hidden sm:block"
          >
            Каталог
          </Link>

          {/* Особистий Кабінет */}
          <Link
            href="/profile"
            className="text-zinc-400 transition-colors hover:text-white"
            aria-label="Особистий кабінет"
          >
            <svg
              className="h-5 w-5 stroke-current fill-none"
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
            className="relative text-zinc-400 transition-colors hover:text-white"
            aria-label="Кошик"
          >
            <svg
              className="h-5 w-5 stroke-current fill-none"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>

            {/* Монохромний бедж */}
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-extrabold text-black">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}