import { auth } from "@/auth";
import { loginWithGoogle, logout } from "@/app/actions/auth";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const recentOrders = [
  { id: "#1048", item: "Худі BARYLUX Oversize Black", status: "В обробці", date: "04.10.2026", amount: "1,890 ₴" },
  { id: "#1039", item: "Штани Cargo Techwear", status: "Доставлено", date: "28.09.2026", amount: "2,180 ₴" },
];

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col justify-between bg-[#0D0E12] text-zinc-100 selection:bg-orange-500 selection:text-black">
        <Header />

        <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-4 py-16">
          <div className="w-full rounded-2xl border border-[#262933] bg-[#12141C] p-8 text-center shadow-xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-500">
              [ BARYLUX CLUB ]
            </span>
            <h1 className="mt-3 text-2xl font-bold text-white">Вхід до акаунту</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Увійдіть через Google, щоб переглядати свої замовлення та керувати доставкою.
            </p>

            <form action={loginWithGoogle} className="mt-6">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#262933] bg-white/5 py-3 px-4 text-sm font-semibold text-white transition hover:border-orange-500/50 hover:bg-orange-500/10 active:scale-[0.98]"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                  />
                </svg>
                Увійти через Google
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const { name, email, image } = session.user;

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0D0E12] text-zinc-100 selection:bg-orange-500 selection:text-black">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <section className="rounded-2xl border border-[#262933] bg-[#12141C] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {image ? (
                <Image
                  src={image}
                  alt={name || "User"}
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-orange-500/80 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 text-xl font-bold text-orange-500">
                  {name?.[0] || "U"}
                </div>
              )}

              <div>
                <h1 className="text-2xl font-bold text-white mt-0.5">{name}</h1>
                <p className="text-sm text-zinc-400">{email}</p>
              </div>
            </div>

            <form action={logout}>
              <button className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/20">
                Вийти з акаунту
              </button>
            </form>
          </div>
        </section>

        <div className="mt-8 grid gap-8 md:grid-cols-[1.6fr_1fr]">
          <section className="rounded-2xl border border-[#262933] bg-[#12141C] p-6">
            <h2 className="text-lg font-bold text-white mb-4">Історія замовлень</h2>

            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-orange-500/30"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-orange-500">{order.id}</span>
                        <span className="text-xs text-zinc-500">• {order.date}</span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-zinc-200">{order.item}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300">
                        {order.status}
                      </span>
                      <span className="text-sm font-bold text-white">{order.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">У вас поки немає замовлень.</p>
            )}
          </section>

          <section className="rounded-2xl border border-[#262933] bg-[#12141C] p-6 h-fit">
            <h2 className="text-lg font-bold text-white mb-4">Доставка (Нова Пошта)</h2>
            
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Місто</p>
                <p className="text-sm font-medium text-zinc-200">м. Київ</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Відділення</p>
                <p className="text-sm font-medium text-zinc-200">Відділення №15 (до 30 кг)</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">Телефон</p>
                <p className="text-sm font-medium text-zinc-200">+38 (067) 123-45-67</p>
              </div>
            </div>

            <button className="mt-4 w-full rounded-xl border border-[#262933] bg-white/5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-orange-500/40 hover:text-white">
              Редагувати дані
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}