import { i18n } from "next-i18next";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const LanguageSwitcher = () => {
  const router = useRouter();

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
        // disabled={locale === "en"}
        className="text-[25px] px-1 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:opacity-60"
      >
        🇬🇧
      </button>
      <button
        onClick={() => changeLanguage("fr")}
        // disabled={locale === "fr"}
        className="text-[25px] px-1 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:opacity-60"
      >
        🇫🇷
      </button>
      <button
        onClick={() => changeLanguage("de")}
        // disabled={locale === "de"}
        className="text-[25px] px-1 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:opacity-60"
      >
        🇩🇪
      </button>
    </div>
  );
};

export default LanguageSwitcher;
