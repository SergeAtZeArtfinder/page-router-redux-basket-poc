import type { AppProps } from "next/app";

import { StyledMain, StyledHeader, StyledFooter } from "@/components/Layout";
import GlobalStyles from "@/components/GlobalStyles";
import Navigation from "@/components/Navigation";

interface AppPageProps extends AppProps {
  pageProps: Record<string, unknown>;
}

export default function App({ Component, pageProps }: AppPageProps) {
  return (
    <>
      <GlobalStyles />
      <StyledHeader>
        <Navigation />
      </StyledHeader>
      <StyledMain>
        <Component {...pageProps} />
      </StyledMain>
      <StyledFooter>
        <p>© {new Date().getFullYear()} Next.js TypeScript</p>
      </StyledFooter>
    </>
  );
}
