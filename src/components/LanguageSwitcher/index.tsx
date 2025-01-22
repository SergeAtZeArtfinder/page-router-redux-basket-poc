// filepath: /Users/sergebasangovs/Documents/Training/basket-redux-poc/src/components/LanguageSwitcher.tsx
import { useRouter } from "next/router";
import { i18n } from "next-i18next";

const LanguageSwitcher = () => {
  const router = useRouter();
  const { locale } = router;

  const changeLanguage = (lng: string) => {
    i18n?.changeLanguage(lng);
    router.push(router.pathname, router.asPath, { locale: lng });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => changeLanguage("en")}
        disabled={locale === "en"}
        className="text-[25px] px-1 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
      >
        🇬🇧
      </button>
      <button
        onClick={() => changeLanguage("fr")}
        disabled={locale === "fr"}
        className="text-[25px] px-1 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
      >
        🇫🇷
      </button>
      <button
        onClick={() => changeLanguage("de")}
        disabled={locale === "de"}
        className="text-[25px] px-1 rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
      >
        🇩🇪
      </button>
    </div>
  );
};

export default LanguageSwitcher;
