import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0A0A0C] text-zinc-100 selection:bg-white selection:text-black">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 border-b border-[#1C1E24] pb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            [ CHECKOUT ]
          </span>
          <h1 className="mt-1 text-2xl font-black uppercase text-white">Замовлення оформлено</h1>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-[#1C1E24] bg-[#0A0A0C] p-8 text-center">
          <h2 className="text-2xl font-bold text-white">Дякуємо за ваше замовлення!</h2>
          <p className="text-lg text-zinc-400">
            Ваше замовлення успішно оформлено. Ми зв'яжемося з вами найближчим часом для підтвердження деталей.
            </p>
            <p className="text-lg text-zinc-400">
            Ви можете перевірити статус вашого замовлення в особистому кабінеті або зв'язатися з нами за допомогою контактної інформації, наданої на сайті.
          </p>
          <Link
            href="/"
            className="mt-4 rounded bg-[#1C1E24] px-6 py-3 text-lg font-semibold text-white transition-colors duration-300 hover:bg-[#2C2E34]"
          >
            Повернутися на головну
          </Link>
        </div>
        </main>
        <Footer />
    </div>
  );
}
