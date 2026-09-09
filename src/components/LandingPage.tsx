import Link from "next/link";

export default function Landing() {
  return (
    <main className="flex min-h-[calc(100vh-69px)] flex-col items-center justify-center bg-[#1A1A1D] px-4 select-none">
      <div className="flex max-w-5xl flex-col items-center text-center">
        
        {/* Головний заголовок з легким неоновим світінням */}
        <h1 className="text-5xl font-black uppercase tracking-tight text-[#950740] sm:text-7xl md:text-8xl lg:text-9xl drop-shadow-[0_0_35px_rgba(149,7,64,0.45)]">
          Barylux <span className="text-[#C3073F]">shop</span>
        </h1>

        {/* Підзаголовок у колір #4E4E50 з трекінгом літер */}
        <p className="mt-3 mb-5 max-w-xl text-xs font-medium uppercase tracking-[0.25em] text-[#4E4E50] sm:text-sm">
          Одяг по вигідним цінам <span className="mx-1 text-[#6F2232]">•</span> Відправка в день замовлення <span className="mx-1 text-[#6F2232]">•</span> Накладний платіж
        </p>
        <p className="mb-8 max-w-2xl font-medium uppercase tracking-[0.25em] text-[#4E4E50] text-center sm:text-sm">
          На сайті ви можете переглянути наявність товарів, але замовлення ми приймаємо тільки через інстаграм - <a href="https://www.instagram.com/barylux.ua/" target="_blank" rel="noopener noreferrer" className="text-[#950740] hover:text-[#C3073F]">
            @barylux.ua
          </a>
        </p>

        {/* Кнопка з ховером та свіченням границі */}
        <Link href="/products">
          <button className="group relative overflow-hidden rounded-full border border-[#950740] px-10 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-[#C3073F] hover:shadow-[0_0_25px_rgba(195,7,63,0.6)]">
            {/* Анімований круг */}
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-full -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-[#C3073F] transition-transform duration-500 ease-out group-hover:scale-[2.5]"
            />
            {/* Текст кнопки */}
            <span className="relative z-10">
              Переглянути наявність
            </span>
          </button>
        </Link>
        
      </div>
    </main>
  );
}