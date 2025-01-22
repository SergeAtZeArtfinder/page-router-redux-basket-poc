import "@/styles/globals.css";
import App, { type AppProps, type AppContext } from "next/app";
import { Provider } from "react-redux";
import { SessionProvider } from "next-auth/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";

import { type RootState, useStore } from "@/lib/redux/store";
import Navigation from "@/components/Navigation";
import { COOKIE_NAME, LOCALE_MAP } from "@/constants";

const getCookieByName = (name: string, cookieString?: string) => {
  if (!cookieString) return null; // Return null if no cookies are present

  // Split the cookie string into individual cookies
  const cookies = cookieString.split(";");

  // Loop through each cookie to find the one with the matching name
  for (const cookie of cookies) {
    // Trim whitespace and split into key-value pairs
    const [key, value] = cookie.trim().split("=");

    if (key === name) {
      return decodeURIComponent(value); // Decode and return the value
    }
  }

  return null;
};

interface AppPageProps extends AppProps {
  pageProps: Record<string, unknown> & { preloadedState: RootState };
  locale: string;
}

export default function MyApp({ Component, pageProps }: AppPageProps) {
  const store = useStore(pageProps.preloadedState);

  return (
    <I18nextProvider i18n={i18n}>
      <SessionProvider>
        <Provider store={store}>
          <header className="max-w-6xl border-b mx-auto border-slate-300">
            <Navigation />
          </header>
          <main className="min-h-screen max-w-6xl mx-auto py-2">
            <Component {...pageProps} />
          </main>
        </Provider>
      </SessionProvider>
    </I18nextProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  const cookie = appContext.ctx.req?.headers.cookie || "";
  const locale = getCookieByName(COOKIE_NAME.LOCALE, cookie) || "en-gb";

  if (appContext.ctx.req) {
    await i18n.changeLanguage(LOCALE_MAP[locale]);
  }

  return { ...appProps, locale };
};
