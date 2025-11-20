import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getLocale, getMessages } from "next-intl/server";
import { getDirection, type Locale } from "@/i18n/config";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Liora",
    default: "Liora",
  },
  description: "The social media app for powernerds",
  icons: {
    icon: "/favicon.ico",
  },
};

/**
 * Root Layout Component
 *
 * This is the root layout for the entire application.
 * It sets up fonts and HTML attributes (lang, dir) based on locale.
 * Locale-specific providers are in [locale]/layout.tsx
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get locale for HTML attributes
  // Default to 'en' if not available (e.g., on root page redirect)
  let locale: Locale = "en";
  try {
    locale = (await getLocale()) as Locale;
  } catch {
    // If getLocale fails (e.g., on root redirect), use default
  }
  const direction = getDirection(locale);

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
