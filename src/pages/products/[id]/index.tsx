import React from "react";
import type { NextPage, GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Head from "next/head";
import Image from "next/image";
import { useSelector } from "react-redux";
import { getServerSession } from "next-auth";

import {
  type RootState,
  initializeStore,
  useAppDispatch,
} from "@/lib/redux/store";
import {
  setInitialProduct,
  fetchProductDetails,
} from "@/lib/redux/productsSlice";
import { setInitialCart } from "@/lib/redux/cartSlice";
import { updateCartQuantity } from "@/lib/redux/cartSlice";
import { getCartWithShipping } from "@/lib/db/cart";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import { formatDateToString, formatPrice, serializeDates } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

type PageParams = {
  id: string;
} & ParsedUrlQuery;

export const getServerSideProps: GetServerSideProps<
  { [key: string]: unknown },
  PageParams
> = async ({ params, req, res }) => {
  const productId = params?.id;
  if (!productId) {
    return {
      notFound: true,
    };
  }
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return {
      notFound: true,
    };
  }
  const formatted = formatDateToString(product);
  const session = await getServerSession(req, res, authOptions);
  const cartFound = await getCartWithShipping({
    cookies: req.cookies,
    session,
  });
  const formattedCart = cartFound ? serializeDates(cartFound) : null;
  const store = initializeStore();

  store.dispatch(setInitialProduct(formatted));
  store.dispatch(setInitialCart(formattedCart));

  const { products, cart } = store.getState();

  return {
    props: {
      preloadedState: { products, cart },
      productId,
    },
  };
};

interface PageProps {
  productId: string;
}

const ProductDetailsPage: NextPage<PageProps> = ({ productId }) => {
  const { data, loading } = useSelector((state: RootState) => state.products);
  const dispatch = useAppDispatch();

  const product = data.find((product) => product.id === productId);

  const handleAddToCart = (productId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(updateCartQuantity({ productId }));
    dispatch(fetchProductDetails(productId));
  };

  if (!product) {
    return (
      <>
        <Head>
          <title>Not Found</title>
          <meta name="description" content="Next page" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <p>Product not found</p>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>{product.name}</title>
        <meta name="description" content={product.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <h1 className="text-center mb-12 text-5xl font-bold">
          {product?.name}
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <figure className="rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={800}
              height={400}
              className="h-96 object-cover"
            />
          </figure>
          <div className="flex flex-col gap-4">
            <p>{product.description}</p>
            <Badge className="text-lg font-semibold ml-auto">
              Price: {formatPrice(product.price)}
            </Badge>
            <p className="text-lg font-semibold">
              Quantity: {product.quantity}
            </p>
            <Button
              onClick={() => {
                handleAddToCart(product.id);
              }}
              className="w-full mt-auto mb-1 text-xl font-semibold flex gap-4 justify-center items-center"
              disabled={loading}
            >
              {loading && <Spinner />}
              Add to cart
            </Button>
          </div>
        </div>
      </>
    </>
  );
};

export default ProductDetailsPage;
