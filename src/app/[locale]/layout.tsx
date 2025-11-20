import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "../ReactQueryProvider";
import { extractRouterConfig } from "uploadthing/server";
import { fileRouter } from "../api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { getLocale, getMessages } from "next-intl/server";
import LocaleProvider from "@/components/LocaleProvider";
import { getDirection, type Locale } from "@/i18n/config";

/**
 * Locale Layout Component
 *
 * This layout wraps all locale-specific pages.
 * It:
 * - Configures i18n with locale and direction (RTL/LTR)
 * - Provides theme support (dark/light mode)
 * - Sets up React Query for data fetching
 * - Configures UploadThing for file uploads
 * 
 * Note: This is a nested layout, so it should NOT include <html> or <body> tags.
 */
export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Get the current locale and messages for i18n
  const { locale: localeParam } = await params;
  const locale = (localeParam || (await getLocale())) as Locale;
  const messages = await getMessages();
  const direction = getDirection(locale);

  return (
    <LocaleProvider messages={messages} locale={locale}>
      <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
      <ReactQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </ReactQueryProvider>
      <Toaster />
    </LocaleProvider>
  );
}

