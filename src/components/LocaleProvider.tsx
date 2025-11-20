"use client";

import { NextIntlClientProvider } from "next-intl";
import { useEffect } from "react";
import { getDirection, type Locale } from "@/i18n/config";

/**
 * Locale Provider Component
 * 
 * This component:
 * - Provides translations to the app via NextIntlClientProvider
 * - Sets the HTML dir and lang attributes based on the current locale
 * - Ensures RTL/LTR direction is applied correctly
 */
export default function LocaleProvider({
  children,
  messages,
  locale,
}: {
  children: React.ReactNode;
  messages: any;
  locale: Locale;
}) {
  const direction = getDirection(locale);

  // Update HTML attributes when locale changes
  useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
    document.documentElement.setAttribute("lang", locale);
  }, [locale, direction]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

