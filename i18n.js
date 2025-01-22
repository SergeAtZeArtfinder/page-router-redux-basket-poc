import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-GB',
    // debug: process.env.NODE_ENV !== 'production',
    detection: {
      order: ['queryString', 'cookie'],
      lookupCookie: 'af-locale',
    },
    supportedLngs: ['en-GB', 'en-US'],
    load: 'currentOnly',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    backend: {
      loadPath: `${process.env.HOST}/v2/locales/{{lng}}/{{ns}}.json`,
    },
  });

export default i18n;
