// app/checkout/page.tsx
import { auth } from "@/auth";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutForm from "./_components/CheckoutForm";

export default async function CheckoutPage() {
  const session = await auth();
  
  let initialCustomer = {
    fullName: "",
    phone: "",
    email: session?.user?.email || "",
  };

  let initialDelivery = {
    city: "",
    warehouse: "",
  };

  if (session?.user?.email) {
    try {
      await connectToDB();
      const dbUser = await User.findOne({ email: session.user.email }).lean();

      if (dbUser) {
        const typedUser = dbUser as any;

        if (typedUser.name || typedUser.fullName) {
          initialCustomer.fullName = typedUser.fullName || typedUser.name || "";
        }
        
        if (typedUser.phone) {
          initialCustomer.phone = typedUser.phone;
        }

        if (typedUser.deliveryAddress) {
          initialCustomer.fullName = typedUser.deliveryAddress.fullName || initialCustomer.fullName;
          initialCustomer.phone = typedUser.deliveryAddress.phone || initialCustomer.phone;
          initialDelivery.city = typedUser.deliveryAddress.city || "";
          initialDelivery.warehouse = typedUser.deliveryAddress.warehouse || "";
        }
      }
    } catch (error) {
      console.error("[CHECKOUT_DB_ERROR]:", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0A0A0C] text-zinc-100 selection:bg-white selection:text-black">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 border-b border-[#1C1E24] pb-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
            [ CHECKOUT ]
          </span>
          <h1 className="mt-1 text-2xl font-black uppercase text-white">Оформлення замовлення</h1>
        </div>

        <CheckoutForm
          initialCustomer={initialCustomer}
          initialDelivery={initialDelivery}
        />
      </main>
      <Footer />
    </div>
  );
}