import Image from "next/image";
import Link from "next/link";

export default function Landing() {
  return (
    <main className="relative flex h-[calc(100vh-65px)] min-h-[620px] w-full flex-col justify-end overflow-hidden bg-[#0A0A0C] select-none">
      {/* 1. Фоновий лукбук */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bh.jpg"
          alt="Barylux Collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 grayscale transition-transform duration-1000 hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/30 to-[#0A0A0C]/80" />
      </div>

      {/* 2. Контентний блок */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Лейбл дропу */}
          <div className="mb-4 inline-flex items-center gap-2 border border-zinc-800 bg-black/50 px-3 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-300">
              New Drop // 2026 Collection
            </span>
          </div>

          {/* Акцентний заголовок */}
          <h1 className="text-4xl font-black uppercase tracking-tight text-white leading-[0.95] sm:text-6xl lg:text-7xl">
            URBAN <br />
            ESSENTIALS
          </h1>

          <p className="mt-4 max-w-md text-xs font-light text-zinc-400 sm:text-sm leading-relaxed">
            Преміальні матеріали, бездоганна посадка та продуманий до дрібниць крой. Одяг, який тримає форму та вирізняє з натовпу.
          </p>

          {/* Кнопки дій */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="group relative inline-flex items-center justify-center bg-white px-8 py-4 text-xs font-extrabold uppercase tracking-widest text-black transition-all hover:bg-zinc-200 active:scale-95"
            >
              <span>Переглянути каталог</span>
            </Link>

            {/* Якірне посилання на блок з новинками */}
            <a
              href="#new-arrivals"
              className="inline-flex items-center justify-center border border-zinc-800 bg-black/40 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:border-zinc-500 hover:bg-black/80 active:scale-95"
            >
              Новинки
            </a>
          </div>
        </div>

        {/* 3. Нижнє інформаційне табло */}
        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-zinc-800/80 pt-6 md:grid-cols-4">
          <div>
            <p className="font-mono text-[10px] uppercase text-zinc-500">Доставка</p>
            <p className="mt-1 text-xs font-semibold text-zinc-300">Відправка в день замовлення</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase text-zinc-500">Оплата</p>
            <p className="mt-1 text-xs font-semibold text-zinc-300">Накладний платіж / Карта</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase text-zinc-500">Якість</p>
            <p className="mt-1 text-xs font-semibold text-zinc-300">Відбірні тканини та фурнітура</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase text-zinc-500">Сервіс</p>
            <p className="mt-1 text-xs font-semibold text-zinc-300">Легкий обмін та повернення</p>
          </div>
        </div>
      </div>
    </main>
  );
}