import { i18n } from "next-i18next";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import { useTranslation } from "../../../i18n";

const LanguageSwitcher = () => {
  const router = useRouter();
  const translation = useTranslation("common");
  const currentLanguage = translation.i18n.language;

  const changeLanguage = async (lng: string) => {
    Cookies.remove("NEXT_LOCALE");
    Cookies.set("NEXT_LOCALE", lng, { expires: 365 });
    await i18n?.changeLanguage(lng);
    router.replace(router.pathname, router.asPath, {
      locale: false,
    });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage("en")}
        disabled={currentLanguage === "en"}
        className="text-[25px] px-1 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:opacity-60"
      >
        🇬🇧
      </button>
      <button
        onClick={() => changeLanguage("fr")}
        disabled={currentLanguage === "fr"}
        className="text-[25px] px-1 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:opacity-60"
      >
        🇫🇷
      </button>
      <button
        onClick={() => changeLanguage("de")}
        disabled={currentLanguage === "de"}
        className="text-[25px] px-1 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:opacity-60"
      >
        🇩🇪
      </button>
    </div>
  );
};

export default LanguageSwitcher;
