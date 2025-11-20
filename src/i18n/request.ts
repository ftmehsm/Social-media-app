import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * i18n Request Configuration
 *
 * This file configures next-intl to work with the App Router.
 * It determines the locale from the URL parameter [locale].
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Get locale from URL parameter (provided by next-intl middleware)
  // This will be the [locale] segment from the URL
  let locale = await requestLocale;

  // Validate locale, fallback to 'en' if invalid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
