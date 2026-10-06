import { auth } from "@/auth";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { loginWithGoogle } from "@/app/actions/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import ProfileHeader from "./_components/ProfileHeader";
import OrderHistory from "./_components/OrderHistory";
import DeliverySection from "./_components/DeliverySection";

export default async function ProfilePage() {
  const session = await auth();

  // 1. ЯКЩО НЕМАЄ СЕСІЇ — ПОКАЗУЄМО БЛОК ВХОДУ (Миттєвий рендер без DB)
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
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
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
                Увійдіть через Google
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // 2. ФЕТЧИМО ДАНІ З МАНГО З БЕЗПЕЧНОЮ СЕРІАЛІЗАЦІЄЮ ТА TRY/CATCH
  let deliveryAddress = null;

  try {
    await connectToDB();
    const dbUser = await User.findOne({ email: session.user.email }).lean();

    if (dbUser?.deliveryAddress) {
      // Серіалізуємо BSON об'єкт у чистий JSON, щоб прибрати ObjectId та полегшити пропси
      deliveryAddress = JSON.parse(JSON.stringify(dbUser.deliveryAddress));
    }
  } catch (error) {
    console.error("Profile page DB error:", error);
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0D0E12] text-zinc-100 selection:bg-orange-500 selection:text-black">
      <Header />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <ProfileHeader user={session.user} />

        <div className="mt-8 grid gap-8 md:grid-cols-[1.6fr_1fr]">
          <OrderHistory orders={[]} />
          <DeliverySection details={deliveryAddress} />
        </div>
      </main>

      <Footer />
    </div>
  );
}