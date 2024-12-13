"use client";

import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

import type { RootState } from "@/lib/redux/store";

const Navigation = (): JSX.Element => {
  const value = useSelector((state: RootState) => state.example.value);

  return (
    <nav className="w-full flex gap-2 max-w-5xl mx-auto h-12 items-center py-6">
      <Link href="/" className="text-lg font-semibold hover:underline">
        Home
      </Link>
      <Link href="/basket" className="text-lg font-semibold hover:underline">
        Basket
      </Link>
      <div className="ml-auto rounded bg-slate-300 p-2">counter: {value}</div>
    </nav>
  );
};

export default Navigation;
