"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { UserCheck } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

const UserButton = (): JSX.Element => {
  const { data: session } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative bg-slate-300 rounded-xl p-2 hover:bg-slate-400 active:bg-slate-400">
        {session?.user ? (
          <Avatar className="w-6 h-6">
            {session.user.image && <AvatarImage src={session.user.image} />}
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <UserCheck />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          Hello {session?.user.name || session?.user.email || "Guest"} !
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {session ? (
          <DropdownMenuItem>
            <Button
              onClick={() => signOut()}
              className="text-lg font-semibold hover:underline"
            >
              Sign Out
            </Button>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>
            <Button
              onClick={() => signIn()}
              className="text-lg font-semibold hover:underline"
            >
              Sign In
            </Button>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
