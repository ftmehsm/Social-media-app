import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "./config";

/**
 * Routing Configuration
 * 
 * Defines how next-intl handles routing with locale prefixes.
 */
export const routing = defineRouting({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always show locale prefix in URL
  localePrefix: "always",
});

// Create typed navigation helpers
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

