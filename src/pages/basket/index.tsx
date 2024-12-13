import React from "react";
import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

interface PageProps {
  [x: string]: unknown;
}

const BasketPage: NextPage<PageProps> = ({}) => {
  return (
    <>
      <Head>
        <title>Basket Page</title>
        <meta name="description" content="Next page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <h1 className="text-center mb-12 text-5xl font-bold">Basket page</h1>
      </>
    </>
  );
};

export default BasketPage;
