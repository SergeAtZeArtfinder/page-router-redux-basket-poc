"use client";

import React from "react";
import { useSelector } from "react-redux";

import { fetchCart } from "@/lib/redux/cartSlice";
import { useAppDispatch, RootState } from "@/lib/redux/store";
import { Button } from "../ui/button";

const CartButton = (): JSX.Element => {
  const cart = useSelector((state: RootState) => state.cart.data);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>(fetchCart());
  };

  return (
    <div className="flex gap-2 items-center">
      <span>Cart: {cart ? cart.items.length : 0}</span>
      <Button onClick={handleClick}>get cart</Button>
    </div>
  );
};

export default CartButton;
