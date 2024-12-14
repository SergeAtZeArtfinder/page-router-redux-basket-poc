import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import type { NextAuthOptions } from "next-auth";

import prisma from "@/lib/db/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { prompt: "select_account" },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const userFound = await prisma.user.findUnique({
        where: { email: user.email },
        select: { role: true },
      });

      session.user.id = user.id;
      session.user.role =
        (userFound?.role as "USER" | "ADMIN" | undefined) || "USER";

      return session;
    },
  },
};
