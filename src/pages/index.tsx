import Head from "next/head";
import { useSelector } from "react-redux";
import { getServerSession } from "next-auth";
import { useTranslation } from "../../i18n";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import type { NextPage, GetServerSideProps } from "next";

import { type RootState, initializeStore } from "@/lib/redux/store";
import { setInitialProducts } from "@/lib/redux/productsSlice";
import { setInitialCart } from "@/lib/redux/cartSlice";
import { getCartWithShipping } from "@/lib/db/cart";
import { serializeDates } from "@/lib/format";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db/prisma";
import ProductCard from "@/components/ProductCard";

export const getServerSideProps: GetServerSideProps<{
  preloadedState: Partial<RootState>;
}> = async ({ req, res, locale }) => {
  const session = await getServerSession(req, res, authOptions);
  const store = initializeStore();
  const productsFound = await prisma.product.findMany();
  const formattedProducts = serializeDates(productsFound);
  const cartFound = await getCartWithShipping({
    cookies: req.cookies,
    session,
  });
  const formattedCart = cartFound ? serializeDates(cartFound) : null;

  // Dispatch actions to update the state
  store.dispatch(setInitialProducts(formattedProducts));
  store.dispatch(setInitialCart(formattedCart));
  const { products, cart } = store.getState();

  return {
    props: {
      preloadedState: { products, cart },
      ...(await serverSideTranslations(locale!, ["common"])),
    },
  };
};

const HomePage: NextPage = () => {
  const { data, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>Zee Redukz Shop | Homepage</title>
        <meta
          name="description"
          content="This is the next app with redux store for basket page poc"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <h1 className="text-center mb-12 text-5xl font-bold">
          {t("greeting")}
        </h1>
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
