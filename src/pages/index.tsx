import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";

import Counter from "@/components/Counter";
import { type RootState, initializeStore } from "@/lib/redux/store";
import { incrementByAmount } from "@/lib/redux/exampleSlice";

const fetchMockData = <D,>(data: D, timeout = 800): Promise<D> =>
  new Promise<D>((resolve) => {
    setTimeout(() => resolve(data), timeout);
  });

export const getServerSideProps: GetServerSideProps<{
  preloadedState: RootState;
}> = async () => {
  const store = initializeStore();
  const newCount = await fetchMockData(12);
  // Dispatch actions to update the state
  store.dispatch(incrementByAmount(newCount));

  return {
    props: {
      preloadedState: store.getState(),
    },
  };
};

const HomePage: NextPage = ({}) => {
  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Next page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <h1 className="text-center mb-12 text-5xl font-bold">Home page</h1>
        <Counter />
      </>
    </>
  );
};

export default HomePage;
