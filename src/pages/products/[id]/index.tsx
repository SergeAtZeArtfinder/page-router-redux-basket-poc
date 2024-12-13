import React from "react";
import type { NextPage, GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import Head from "next/head";
import Image from "next/image";
import { useSelector } from "react-redux";

import { type RootState, initializeStore } from "@/lib/redux/store";
import { setInitialProduct } from "@/lib/redux/productsSlice";
import prisma from "@/lib/db/prisma";
import { formatDateToString, formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PageParams = {
  id: string;
} & ParsedUrlQuery;

export const getServerSideProps: GetServerSideProps<
  { [key: string]: unknown },
  PageParams
> = async ({ params }) => {
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
  const store = initializeStore();
  store.dispatch(setInitialProduct(formatted));

  return {
    props: {
      preloadedState: store.getState(),
      productId,
    },
  };
};

interface PageProps {
  productId: string;
}

const ProductDetailsPage: NextPage<PageProps> = ({ productId }) => {
  const { data } = useSelector((state: RootState) => state.products);

  const product = data.find((product) => product.id === productId);

  if (!product) {
    return (
      <>
        <Head>
          <title>Page</title>
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
        <title>Page</title>
        <meta name="description" content="Next page" />
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
            <p>Quantity: {product.quantity}</p>
            <Button className="w-full mt-auto mb-1 text-xl font-semibold">
              Add to cart
            </Button>
          </div>
        </div>
      </>
    </>
  );
};

export default ProductDetailsPage;
