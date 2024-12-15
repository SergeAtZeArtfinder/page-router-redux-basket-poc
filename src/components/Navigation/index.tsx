"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { MountainSnow } from "lucide-react";

import { useSelector } from "react-redux";

import { type RootState, useAppDispatch } from "@/lib/redux/store";
import { fetchLocation } from "@/lib/redux/locationSlice";
import CartButton from "./CartButton";
import UserButton from "./UserButton";

const Navigation = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useSelector((state: RootState) => state.location.data);
  const onceRef = useRef(false);

  /**
   * fetch location by IP only once when the app is loaded
   */
  useEffect(() => {
    if (!location?.ip && !onceRef.current) {
      dispatch(fetchLocation());
      onceRef.current = true;
    }
  }, [dispatch, location?.ip]);

  return (
    <nav className="w-full flex gap-2 max-w-5xl mx-auto h-12 items-center py-6">
      <Link
        href="/"
        className="text-lg font-semibold w-10 h-10 rounded-xl bg-slate-300 hover:bg-slate-400 active:bg-slate-500 flex items-center justify-center"
      >
        <MountainSnow />
      </Link>
      <div className="ml-auto flex gap-4 items-center">
        <CartButton />
        <UserButton />
      </div>
    </nav>
  );
};

export default Navigation;
