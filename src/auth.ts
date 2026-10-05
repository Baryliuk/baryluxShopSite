import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // 1. Автоматично створюємо/оновлюємо користувача в БД при вході через Google
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          await connectToDB();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
            });
          }
        } catch (error) {
          console.error("Помилка збереження користувача в БД при signIn:", error);
          // Не блокуємо вхід, навіть якщо БД тимчасово недоступна
        }
      }
      return true;
    },

    // 2. Передаємо ID користувача у сесію
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});