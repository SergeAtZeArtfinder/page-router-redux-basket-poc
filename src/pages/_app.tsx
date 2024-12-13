import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { type RootState, useStore } from "@/lib/redux/store";
import Navigation from "@/components/Navigation";

interface AppPageProps extends AppProps {
  pageProps: Record<string, unknown> & { preloadedState: RootState };
}

export default function App({ Component, pageProps }: AppPageProps) {
  const store = useStore(pageProps.preloadedState);

  return (
    <Provider store={store}>
      <Navigation />
      <main className="flex flex-col items-center justify-center min-h-screen py-2">
        <Component {...pageProps} />
      </main>
    </Provider>
  );
}
