import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          await connectToDB();

          const dbUser = await User.findOneAndUpdate(
            { email: user.email },
            {
              $setOnInsert: {
                name: user.name,
                email: user.email,
                image: user.image,
              },
            },
            { upsert: true, new: true, lean: true }
          );

          if (dbUser) {
            user.id = dbUser._id.toString();
          }

          return true;
        } catch (error) {
          console.error("Помилка авторизації/БД:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});