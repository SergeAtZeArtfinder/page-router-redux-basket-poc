"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COOKIE_NAME, LOCALE_MAP } from "@/constants";

const options = [
  { value: "en-gb", label: "English (UK)", flag: "🇬🇧" },
  { value: "en-us", label: "English (US)", flag: "🇺🇸" },
];

const LanguageSelect = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const { i18n } = useTranslation();

  const handleSwitchLanguage = async (locale: string) => {
    setIsLoading(true);
    Cookies.remove(COOKIE_NAME.LOCALE);
    Cookies.set(COOKIE_NAME.LOCALE, locale, { expires: 365 });

    await i18n.changeLanguage(LOCALE_MAP[locale]);
    setIsLoading(false);
  };

  return (
    <div>
      <Select
        onValueChange={(value) => {
          handleSwitchLanguage(value);
        }}
        value={LOCALE_MAP[i18n.language]}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent id="language">
          {options.map(({ value, label, flag }) => (
            <SelectItem key={value} value={value}>
              {label} {flag}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelect;
