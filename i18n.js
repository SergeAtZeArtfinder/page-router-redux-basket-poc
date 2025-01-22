import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { config } from "dotenv";

config({});
const isServer = typeof window === "undefined";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en-GB",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    react: {
      useSuspense: false,
    },
    backend: {
      loadPath: isServer
        ? `${process.env.NEXT_PUBLIC_HOST}/v2/locales/{{lng}}/{{ns}}.json`
        : "/v2/locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18n;
