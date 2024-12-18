import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import clsx from "clsx";

import type { NextPage, GetServerSideProps } from "next";

import {
  type RootState,
  initializeStore,
  useAppDispatch,
} from "@/lib/redux/store";
import {
  setInitialCart,
  updateCartQuantity,
  selectOrDeleteShippingAddress,
} from "@/lib/redux/cartSlice";
import { getCartWithShipping } from "@/lib/db/cart";
import { formatPrice, serializeDates } from "@/lib/format";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import BasketLineItem from "@/components/BasketLineItem";
import ShippingAddress from "@/components/ShippingAddress";
import AddShippingAddress from "@/components/AddShippingAddress";
import { Button } from "@/components/ui/button";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  const store = initializeStore();

  const cartFound = await getCartWithShipping({
    cookies: req.cookies,
    session,
  });
  const formattedCart = cartFound ? serializeDates(cartFound) : null;

  store.dispatch(setInitialCart(formattedCart));

  const { cart } = store.getState();

  return {
    props: {
      preloadedState: { cart },
    },
  };
};

interface PageProps {
  [x: string]: unknown;
}

const BasketPage: NextPage<PageProps> = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const router = useRouter();
  const { data: cart, loading } = useSelector((state: RootState) => state.cart);

  const shippingAddress = cart?.shipping
    ? cart.shipping.find(
        (address) => address.id === cart.selectedShippingAddress
      )
    : null;
  const orderTotal = formatPrice(cart?.total ?? 0);
  const isReadyToCheckout =
    !!cart?.items.length && !!cart.selectedShippingAddress;

  const handleGoToCheckout = () => {
    if (!isReadyToCheckout) return;
    if (session) {
      const order = `
      Order
      =============================================
      User: ${session.user.email ?? "no email"}
      Deliver to: 
         ${shippingAddress?.name}.
         ${shippingAddress?.address ?? "no address"}
         ${shippingAddress?.city + " / " + shippingAddress?.postal}
         ${shippingAddress?.country}
      =============================================
      Order total: ${orderTotal}
      `;
      alert(order);
    } else {
      router.push("/api/auth/signin?callbackUrl=/basket");
    }
  };

  const handleChangeQuantity = ({
    quantity,
    productId,
  }: {
    quantity: number;
    productId: string;
  }) => {
    dispatch(updateCartQuantity({ quantity, productId }));
  };

  const handleUpdateAddress = (
    addressId: string,
    operation: "select" | "delete"
  ) => {
    if (!cart) return;
    dispatch(
      selectOrDeleteShippingAddress({ operation, addressId, cartId: cart.id })
    );
  };

  if (!cart) {
    return (
      <>
        <Head>
          <title>Zee Redukz Shop | Basket Page</title>
          <meta name="description" content="Next page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <>
          <h1 className="text-center mb-12 text-5xl font-bold">Basket page</h1>

          <div className="max-w-md mx-auto flex flex-col justify-center items-center space-y-4 text-lg">
            <p className="text-center">Hey 👋 ! Your basket is empty</p>
            <Link href="/" className="underline">
              🏃🏻‍♂️💨 Go buy something
            </Link>
          </div>
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
          <div className="">
            <h2 className="text-2xl font-bold text-center ">
              Your shipping addresses
            </h2>
            {!cart.shipping.length && (
              <p className="flex-1">
                you don&rsquo;t have any shipping address
              </p>
            )}
            <div className="flex justify-end my-4">
              <AddShippingAddress />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-gallery gap-2">
              {cart.shipping.map((address) => (
                <ShippingAddress
                  key={address.id}
                  address={address}
                  handleUpdate={(operation) => {
                    handleUpdateAddress(address.id, operation);
                  }}
                  isSelected={cart.selectedShippingAddress === address.id}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end justify-end">
            <p className="font-semibold grid grid-cols-[1fr,150px]">
              Subtotal:{" "}
              <span className="flex justify-end">
                {formatPrice(cart.subTotal)}
              </span>
            </p>
            <p className="font-bold ml-auto grid grid-cols-[1fr,150px]">
              Shipping to {shippingAddress?.country ?? ""}:{" "}
              <span
                className={clsx(
                  "flex justify-end",
                  cart.shippingCost === null && "text-red-600"
                )}
              >
                {cart.shippingCost !== null
                  ? formatPrice(cart.shippingCost)
                  : "No shipping selected"}
              </span>
            </p>

            <p className="text-lg font-bold ml-auto grid grid-cols-[1fr,150px]">
              Total: <span className="flex justify-end">{orderTotal}</span>
            </p>
          </div>
          <Button
            onClick={handleGoToCheckout}
            disabled={!isReadyToCheckout}
            variant="destructive"
            className="w-[250px] mt-4 mx-auto text-xl font-semibold"
          >
            Checkout{" "}
          </Button>
        </div>
      </>
    </>
  );
};

export default BasketPage;
