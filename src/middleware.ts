import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Next.js Middleware for i18n
 *
 * This middleware handles:
 * - Redirecting root path (/) to /en
 * - Locale detection from URL and cookies
 * - Setting locale cookie based on URL
 *
 * URLs will include locale prefix (e.g., /en/about, /fa/about)
 */
export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  // Exclude API routes, Next.js internals, and static files
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
