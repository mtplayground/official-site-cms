import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authorizeAdminWithCredentials } from "@/lib/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await authorizeAdminWithCredentials({
            email: credentials?.email as string | undefined,
            password: credentials?.password as string | undefined,
          });

          if (!user) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const nextToken = token as typeof token & { role?: string };

      if (user) {
        nextToken.sub = user.id;
        nextToken.role = (user as { role?: string }).role ?? "ADMIN";
      }

      return nextToken;
    },
    async session({ session, token }) {
      const tokenWithRole = token as typeof token & { role?: string };

      if (session.user) {
        if (typeof tokenWithRole.sub === "string") {
          session.user.id = tokenWithRole.sub;
        }
        session.user.role = tokenWithRole.role ?? "ADMIN";
      }

      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}
