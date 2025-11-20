"use client";

import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { locales, localeConfig, type Locale } from "@/i18n/config";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTransition } from "react";

/**
 * Language Switcher Component
 * 
 * Allows users to switch between supported languages.
 * Automatically navigates to the new locale URL.
 * Handles RTL/LTR direction changes automatically.
 */
export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  /**
   * Handle language change
   * Navigates to the same path but with the new locale
   */
  function handleLanguageChange(newLocale: Locale) {
    if (newLocale === locale) return;

    // Navigate to the same path with the new locale
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  const currentLocaleConfig = localeConfig[locale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          disabled={isPending}
          title="Switch Language"
        >
          <Languages className="h-5 w-5" />
          <span className="sr-only">Switch Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => {
          const config = localeConfig[loc];
          const isActive = loc === locale;

          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => handleLanguageChange(loc)}
              className={isActive ? "bg-accent" : ""}
            >
              <span className="flex items-center gap-2">
                <span>{config.nativeName}</span>
                <span className="text-muted-foreground">({config.name})</span>
                {isActive && <span className="ml-auto">✓</span>}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

