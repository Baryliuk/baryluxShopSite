import Image from "next/image";
import Link from "next/link";

export default function Landing() {
  return (
    <main className="relative flex min-h-[calc(100vh-69px)] flex-col items-center justify-center overflow-hidden bg-[#0D0E12] px-4 select-none">
      <Image
        src="/bh.jpg" 
        alt="Barylux background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-25 grayscale pointer-events-none"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-transparent to-[#0D0E12]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0D0E12] via-transparent to-[#0D0E12]" />

      <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">
        <h1 className="text-5xl font-black uppercase tracking-tight text-white sm:text-7xl md:text-7xl lg:text-8xl drop-shadow-[0_0_35px_rgba(249,115,22,0.12)]">
          Обери свій — <span className="text-orange-500 drop-shadow-[0_0_35px_rgba(249,115,22,0.45)]">стиль</span>
        </h1>

        <p className="mt-3 mb-6 max-w-2xl text-xs font-medium uppercase tracking-[0.25em] text-zinc-400 sm:text-sm">
          <span className="mx-1 text-orange-500/80">•</span> Відправка в день замовлення <span className="mx-1 text-orange-500/80">•</span> <br/>
          <span className="mx-1 text-orange-500/80">•</span> Накладний платіж <span className="mx-1 text-orange-500/80">•</span>
        </p>

        {/* Прямий стилізований Link замість nested button */}
        <Link 
          href="/products"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-orange-500/80 bg-orange-500 px-10 py-3.5 text-xs font-extrabold uppercase tracking-widest text-black transition-all duration-300 hover:border-orange-400 hover:bg-orange-400 hover:shadow-[0_0_30px_rgba(249,115,22,0.45)]"
        >
          <span
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-full -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white/25 transition-transform duration-500 ease-out group-hover:scale-[2.5]"
          />
          <span className="relative z-10">
            Переглянути наявність
          </span>
        </Link>
      </div>
    </main>
  );
}