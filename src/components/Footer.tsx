export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-[#262933] bg-[#121319] px-6 py-10 select-none">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        
        {/* Блок бренду */}
        <div className="text-center md:text-left">
          <span className="font-mono text-base font-bold tracking-[0.3em] text-white">
            BARYLUX
          </span>
          <p className="mt-1 text-xs text-zinc-400">
            © {currentYear} Усі права захищені.
          </p>
        </div>

        {/* Сервісна інформація */}
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-10 md:text-right">
          <div className="text-xs text-zinc-400">
            <span className="mb-1 block font-semibold uppercase tracking-wider text-white">
              Доставка та оплата
            </span>
            Накладений платіж із передоплатою за доставку. Нова Пошта.
          </div>
          
          <div className="text-xs text-zinc-400">
            <span className="mb-1 block font-semibold uppercase tracking-wider text-white">
              Зв'язок з нами
            </span>
            <a 
              href="mailto:baryluxshop@gmail.com" 
              className="text-zinc-400 underline transition-colors hover:text-orange-500"
            >
              baryluxshop@gmail.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}