import NextAuth from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";

import { authOptions } from "@/lib/auth";
import { mergeAnonymousCartIntoUserCart } from "@/lib/db/cart";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    ...authOptions,
    events: {
      async signIn({ user }) {
        await mergeAnonymousCartIntoUserCart({ userId: user.id, req, res });
      },
    },
  });
}
