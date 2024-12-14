import React from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { getServerSession } from "next-auth";

import type { NextPage, GetServerSideProps } from "next";

import {
  type RootState,
  initializeStore,
  useAppDispatch,
} from "@/lib/redux/store";
import { setInitialCart, updateCartQuantity } from "@/lib/redux/cartSlice";
import { getCartWithShipping } from "@/lib/db/cart";
import { formatPrice, serializeDates } from "@/lib/format";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import BasketLineItem from "@/components/BasketLineItem";
import ShippingAddress from "@/components/ShippingAddress";
import { Button } from "@/components/ui/button";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  const store = initializeStore();

  const cart = await getCartWithShipping({
    cookies: req.cookies,
    session,
  });
  const formattedCart = cart ? serializeDates(cart) : null;

  store.dispatch(setInitialCart(formattedCart));

  return {
    props: {
      preloadedState: store.getState(),
    },
  };
};

interface PageProps {
  [x: string]: unknown;
}

const BasketPage: NextPage<PageProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { data: cart, loading } = useSelector((state: RootState) => state.cart);

  const handleChangeQuantity = ({
    quantity,
    productId,
  }: {
    quantity: number;
    productId: string;
  }) => {
    dispatch(updateCartQuantity({ quantity, productId }));
  };

  if (!cart) {
    return (
      <>
        <Head>
          <title>Basket Page</title>
          <meta name="description" content="Next page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <>
          <h1 className="text-center mb-12 text-5xl font-bold">Basket page</h1>

          <p className="text-center">Hey 👋 ! Your basket is empty</p>
          <Link href="/"> 🏃🏻‍♂️💨 Go buy something</Link>
        </>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Basket Page</title>
        <meta name="description" content="Next page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <h1 className="mb-12 text-3xl font-bold">Your Basket</h1>

        <div className="grid grid-cols-1 gap-4">
          {cart.items.map((item) => (
            <BasketLineItem
              key={item.product.id}
              item={item}
              loading={loading}
              onChangeQuantity={(quantity) => {
                handleChangeQuantity({ quantity, productId: item.product.id });
              }}
            />
          ))}
          <div className="flex gap-2 justify-center">
            {!cart.shipping.length && (
              <p className="flex-1">
                you don&rsquo;t have any shipping address
              </p>
            )}
            <div className="flex-1">
              <Button>+ address</Button>
            </div>
            {cart.shipping.map((address) => (
              <ShippingAddress
                key={address.id}
                address={address}
                handleUpdate={(operation) => {
                  console.log("operation :>> ", operation, {
                    cartId: cart.id,
                    addressId: address.id,
                  });
                }}
              />
            ))}
          </div>
          <div className="flex justify-end">
            <p className="text-lg font-semibold">
              Subtotal: {formatPrice(cart.subTotal)}
            </p>
          </div>
        </div>
      </>
    </>
  );
};

export default BasketPage;
