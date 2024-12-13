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
      <main className="min-h-screen max-w-6xl mx-auto py-2">
        <Component {...pageProps} />
      </main>
    </Provider>
  );
}
