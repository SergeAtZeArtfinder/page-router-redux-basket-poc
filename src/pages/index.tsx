import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import { useSelector } from "react-redux";
import { getServerSession } from "next-auth";

import { type RootState, initializeStore } from "@/lib/redux/store";
import { setInitialProducts } from "@/lib/redux/productsSlice";
import { setInitialCart } from "@/lib/redux/cartSlice";
import { getCartWithShipping } from "@/lib/db/cart";
import { serializeDates } from "@/lib/format";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import ProductCard from "@/components/ProductCard";

export const getServerSideProps: GetServerSideProps<{
  preloadedState: RootState;
}> = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  const store = initializeStore();
  const products = await prisma.product.findMany();
  const formattedProducts = serializeDates(products);
  const cart = await getCartWithShipping({
    cookies: req.cookies,
    session,
  });
  const formattedCart = cart ? serializeDates(cart) : null;

  // Dispatch actions to update the state
  store.dispatch(setInitialProducts(formattedProducts));
  store.dispatch(setInitialCart(formattedCart));

  return {
    props: {
      preloadedState: store.getState(),
    },
  };
};

const HomePage: NextPage = () => {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Next page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <h1 className="text-center mb-12 text-5xl font-bold">Home page</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {data &&
            data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </>
    </>
  );
};

export default HomePage;
