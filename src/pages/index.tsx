import { useState } from "react";
import Head from "next/head";
import styled from "styled-components";

import type { NextPage } from "next";

import Modal from "@/components/Modal";

const Title = styled.h1`
  font-size: 2em;
  text-align: center;
  color: palevioletred;
`;

const ExtendedTitle = styled(Title)`
  font-size: 1.5em;
  color: tomato;
  text-decoration: underline;
`;

const HomePage: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Next page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <>
        <ExtendedTitle>Home page</ExtendedTitle>
        <div>
          <button onClick={() => setIsModalOpen(true)}>Open Modal</button>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div>
              <h2>Modal Content</h2>
              <p>This is rendered using React Portal</p>
            </div>
          </Modal>
        </div>
      </>
    </>
  );
};

export default HomePage;
