import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "@/lib/redux/store";
import Navigation from "@/components/Navigation";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Navigation />
      <main className="flex flex-col items-center justify-center min-h-screen py-2">
        <Component {...pageProps} />
      </main>
    </Provider>
  );
}
