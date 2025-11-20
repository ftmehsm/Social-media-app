"use client";

import { useTranslations } from "next-intl";

/**
 * Client Component for Bookmarks Page Header
 * 
 * Separated to allow use of useTranslations hook.
 */
export default function BookmarksClient() {
  const t = useTranslations("common");

  return (
    <div className="rounded-2xl bg-card p-5 shadow-sm">
      <h1 className="text-center text-2xl font-bold">{t("bookmarks")}</h1>
    </div>
  );
}

