"use client";

import React from "react";
import Link from "next/link";
import styled from "styled-components";

const StyledNavbar = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  & > a {
    color: #fff;
    text-decoration: none;
    padding: 1rem;
  }
`;

const Navigation = (): JSX.Element => {
  return (
    <StyledNavbar>
      <Link href="/">Home</Link>
    </StyledNavbar>
  );
};

export default Navigation;
