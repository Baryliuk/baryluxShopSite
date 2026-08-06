export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-[#6F2232]/30 bg-[#1A1A1D] px-6 py-10 select-none">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
        
        {/* Блок бренду */}
        <div className="text-center md:text-left">
          <span className="font-mono text-base font-bold tracking-[0.3em] text-white">
            BARYLUX
          </span>
          <p className="mt-1 text-xs text-[#4E4E50]">
            © {currentYear} Усі права захищені.
          </p>
          <p className="text-xs text-[#4E4E50]">
            Тут ви можете подивитись наявність, а замовлення оформляємо тільки в інстаграмі.
          </p>
        </div>

        {/* Сервісна інформація */}
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-10 md:text-right">
          <div className="text-xs text-[#4E4E50]">
            <span className="mb-1 block font-semibold uppercase tracking-wider text-white">
              Доставка та оплата
            </span>
            Накладний платіж або передоплата. Нова Пошта.
          </div>
          
          <div className="text-xs text-[#4E4E50]">
            <span className="mb-1 block font-semibold uppercase tracking-wider text-white">
              Зв'язок з нами
            </span>
            <a 
              href="https://www.instagram.com/barylux.ua/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 underline transition-colors hover:text-[#C3073F]"
            >
              Instagram: @barylux.ua
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}