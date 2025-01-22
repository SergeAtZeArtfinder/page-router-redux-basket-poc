"use client";

import React from "react";
import { useTranslation } from "react-i18next";

import { logger } from "@/lib/utils";

const Greeting = (): JSX.Element | null => {
  const { t } = useTranslation();
  logger(t("greeting"));

  return (
    <h2 className="text-lg font-semibold text-sky-700">{t("greeting")}</h2>
  );
};

export default Greeting;
