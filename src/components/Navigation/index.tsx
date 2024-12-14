"use client";

import React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

import { Button } from "../ui/button";
import CartButton from "./CartButton";

const Navigation = (): JSX.Element => {
  const { data: session } = useSession();

  return (
    <nav className="w-full flex gap-2 max-w-5xl mx-auto h-12 items-center py-6">
      <Link href="/" className="text-lg font-semibold hover:underline">
        Home
      </Link>
      <Link href="/basket" className="text-lg font-semibold hover:underline">
        Basket
      </Link>
      <div className="ml-auto flex gap-4 items-center">
        <CartButton />
        {session ? (
          <Button
            onClick={() => signOut()}
            className="text-lg font-semibold hover:underline"
          >
            Sign Out
          </Button>
        ) : (
          <Button
            onClick={() => signIn()}
            className="text-lg font-semibold hover:underline"
          >
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
