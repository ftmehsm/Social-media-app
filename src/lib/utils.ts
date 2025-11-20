import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale/fa-IR";
import { enUS } from "date-fns/locale";
import type { Locale as DateFnsLocale } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format relative date with locale support
 * @param from - The date to format
 * @param locale - The locale ('en' or 'fa'), defaults to 'en'
 */
export function formatRelativeDate(from: Date, locale: "en" | "fa" = "en") {
  const currentDate = new Date();
  const dateLocale: DateFnsLocale = locale === "fa" ? faIR : enUS;

  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNow(from, { addSuffix: true, locale: dateLocale });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d", { locale: dateLocale });
    } else {
      return formatDate(from, "MMM d, yyyy", { locale: dateLocale });
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/**
 * Check if a URL is from UploadThing CDN (utfs.io)
 * @param url - The URL to check
 * @returns true if the URL is from UploadThing
 */
export function isUploadThingUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === "utfs.io" || urlObj.hostname.endsWith(".ufs.sh");
  } catch {
    return false;
  }
}

/**
 * Convert old UploadThing URL format (/a/) to new format (/f/)
 * Old format: https://{appId}.ufs.sh/a/{appId}/{fileKey}
 * New format: https://utfs.io/f/{fileKey}
 * @param url - The URL to convert
 * @returns The converted URL, or original URL if not an old UploadThing URL
 */
export function convertUploadThingUrl(
  url: string | null | undefined,
): string | null | undefined {
  if (!url) return url;

  try {
    const urlObj = new URL(url);

    // Check if it's an old format URL (ends with .ufs.sh and has /a/ in path)
    if (
      urlObj.hostname.endsWith(".ufs.sh") &&
      urlObj.pathname.includes("/a/")
    ) {
      // Extract the file key from the old format
      // Path format: /a/{appId}/{fileKey}
      const pathParts = urlObj.pathname
        .split("/")
        .filter((part) => part !== "");

      // Find the index of "a"
      const aIndex = pathParts.indexOf("a");

      if (aIndex !== -1 && pathParts.length > aIndex + 2) {
        // Get everything after /a/{appId}/ as the file key
        // Skip "a" (index) and appId (index+1), take rest
        const fileKey = pathParts.slice(aIndex + 2).join("/");
        // Convert to new format
        return `https://utfs.io/f/${fileKey}`;
      }
    }

    // If already in new format or not an UploadThing URL, return as is
    return url;
  } catch {
    // If URL parsing fails, return original
    return url;
  }
}
