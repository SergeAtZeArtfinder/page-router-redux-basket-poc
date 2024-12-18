"use client";

import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";

import { type RootState, useAppDispatch } from "@/lib/redux/store";
import { updateCartQuantity } from "@/lib/redux/cartSlice";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

interface Props {
  productId: string;
  className?: string;
  children: React.ReactNode;
}

const AddToCartCTA = ({
  productId,
  className,
  children,
}: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const cart = useSelector((state: RootState) => state.cart);

  const handleAddToCart = () => {
    dispatch(updateCartQuantity({ productId }));
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={clsx(
        "w-full mt-auto mb-1 text-xl font-semibold flex gap-4 justify-center items-center",
        className
      )}
      disabled={cart.loading}
    >
      {cart.loading && <Spinner />}
      {children}
    </Button>
  );
};

export default AddToCartCTA;
