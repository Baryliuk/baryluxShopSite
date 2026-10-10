import { auth } from "@/auth";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import { loginWithGoogle } from "@/app/actions/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import ProfileHeader from "./_components/ProfileHeader";
import OrderHistory from "./_components/OrderHistory";
import DeliverySection from "./_components/DeliverySection";

export interface IDeliveryAddress {
  fullName?: string;
  phone?: string;
  city?: string;
  warehouse?: string;
}

export default async function ProfilePage() {
  const session = await auth();

  // 1. Unauthenticated State
  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col justify-between bg-[#0A0A0C] text-zinc-100 selection:bg-white selection:text-black">
        <Header />

        <main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-4 py-16">
          <div className="w-full rounded-2xl border border-[#1C1E24] bg-[#0E0E11] p-8 text-center shadow-2xl backdrop-blur-md">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              [ BARYLUX CLUB ]
            </span>
            <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-white">
              Вхід до акаунту
            </h1>
            <p className="mt-2 text-xs font-light leading-relaxed text-zinc-400">
              Увійдіть через Google, щоб відстежувати замовлення та зберігати реквізити доставки.
            </p>

            <form action={loginWithGoogle} className="mt-6">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#1C1E24] bg-white px-4 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-zinc-200 active:scale-[0.98]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
                </svg>
                Продовжити з Google
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // 2. Fetch User
  let deliveryAddress: IDeliveryAddress | null = null;
  const userOrders = []; // Порожній масив, поки немає розробленої схеми Order

  const userEmail = session.user.email;

  if (userEmail) {
    try {
      await connectToDB();

      const dbUser = await User.findOne({ email: userEmail }).lean();

      if (dbUser?.deliveryAddress) {
        deliveryAddress = JSON.parse(JSON.stringify(dbUser.deliveryAddress));
      }
    } catch (error) {
      console.error("[PROFILE_DB_ERROR]:", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0A0A0C] text-zinc-100 selection:bg-white selection:text-black">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <ProfileHeader user={session.user} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.8fr_1fr]">
          <OrderHistory orders={userOrders} />
          <DeliverySection details={deliveryAddress} />
        </div>
      </main>

      <Footer />
    </div>
  );
}