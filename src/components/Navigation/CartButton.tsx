"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchCart } from "@/lib/redux/cartSlice";
import { useAppDispatch, RootState } from "@/lib/redux/store";

import { formatPrice } from "@/lib/format";
import Link from "next/link";

const CartButton = (): JSX.Element => {
  const cart = useSelector((state: RootState) => state.cart.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!cart) {
      dispatch(fetchCart());
    }
  }, [cart, dispatch]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative bg-slate-300 rounded-xl p-2 hover:bg-slate-400 active:bg-slate-400">
        <ShoppingCart />
        <Badge className="absolute w-[20px] h-[20px] top-[-4px] right-[-8px] rounded-full p-0 flex justify-center items-center">
          {cart?.size || 0}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>You have {cart?.size || 0} items</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Sub-total: {formatPrice(cart?.subTotal || 0)}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            asChild
            variant="destructive"
            className="font-bold text-lg cursor-pointer "
          >
            <Link href="/basket">see you basket</Link>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartButton;
