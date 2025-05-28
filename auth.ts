import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Google from "next-auth/providers/google";
import { clientPromise } from "@/lib/mongodb";
import type { DefaultSession, User } from "next-auth";
import type { Session } from "next-auth";

// Session tipi için özel tip tanımlaması
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
    } & DefaultSession["user"];
  }
}

// NextAuth.js'in son sürüm yapılandırması
export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: Session; user: User }) {
      // Oturum bilgilerine kullanıcı bilgilerini ekleyin
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
};

// Auth başlatma
export const { auth, signIn, signOut } = NextAuth(authOptions); 