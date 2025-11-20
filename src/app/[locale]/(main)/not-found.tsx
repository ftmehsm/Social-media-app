"use client";

import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <main className=" w-full text-center my-12 space-y-3">
      <h1 className="text-2xl font-bold">404 - {t("notFound")}</h1>
      <p className="text-muted-foreground">{t("notFound")}</p>
    </main>
  );
}