// filepath: /Users/sergebasangovs/Documents/Training/basket-redux-poc/i18n.js
import { appWithTranslation, useTranslation } from "next-i18next";
import i18next from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const isServer = typeof window === "undefined";

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    backend: {
      loadPath: isServer
        ? `${process.cwd()}/public/locales/{{lng}}/{{ns}}.json`
        : "/locales/{{lng}}/{{ns}}.json",
    },
  });

export { appWithTranslation, useTranslation, i18next };
