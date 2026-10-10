export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-[#1C1E24] bg-[#0A0A0C] px-6 py-10 select-none">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        
        {/* Блок бренду */}
        <div className="text-center md:text-left">
          <span className="font-mono text-sm font-black tracking-[0.3em] text-white">
            BARYLUX
          </span>
          <p className="mt-1 text-[11px] text-zinc-500">
            © {currentYear} Усі права захищені.
          </p>
        </div>

        {/* Сервісна інформація */}
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-10 md:text-right">
          <div className="text-xs text-zinc-400">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white">
              Доставка та оплата
            </span>
            Накладений платіж із передоплатою. Нова Пошта.
          </div>
          
          <div className="text-xs text-zinc-400">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white">
              Зв'язок з нами
            </span>
            <a 
              href="mailto:baryluxshop@gmail.com" 
              className="text-zinc-400 underline underline-offset-4 transition-colors hover:text-white"
            >
              baryluxshop@gmail.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}