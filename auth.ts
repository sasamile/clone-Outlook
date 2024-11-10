import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole, Entity } from "@prisma/client";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/actions/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      if (!existingUser) return false;

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (token.entity && session.user) {
        session.user.entity = token.entity as Entity;
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;
      token.role = existingUser.role;
      token.id = existingUser.id;
      token.name = existingUser.name;
      token.image = existingUser.image;
      token.entity = existingUser.entity;
      token.email = existingUser.email;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
