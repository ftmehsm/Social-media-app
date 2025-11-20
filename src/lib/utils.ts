import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDate, formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale/fa-IR";
import { enUS } from "date-fns/locale";
import type { Locale as DateFnsLocale } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format relative date with locale support
 * @param from - The date to format
 * @param locale - The locale ('en' or 'fa'), defaults to 'en'
 */
export function formatRelativeDate(from: Date, locale: "en" | "fa" = "en") {
  const currentDate = new Date();
  const dateLocale: DateFnsLocale = locale === "fa" ? faIR : enUS;

  if(currentDate.getTime() - from.getTime() < 24*60*60*1000) {
    return formatDistanceToNow(from, { addSuffix: true, locale: dateLocale });
  } else{
    if(currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "MMM d", { locale: dateLocale });
    } else {
      return formatDate(from, "MMM d, yyyy", { locale: dateLocale });
    }
  }
}


export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US" , { notation: "compact" , maximumFractionDigits: 1 }).format(n);
}