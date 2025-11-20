"use client";

import Link from "next/link";
import UserButton from "@/components/UserButton";
import SearchField from "@/components/SearchField";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/**
 * Navbar Component
 * 
 * Main navigation bar with app name, search, language switcher, and user button.
 * All text is internationalized.
 */
const Navbar = () => {
  const t = useTranslations("common");

  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          {t("appName")}
        </Link>
        <SearchField />
        <div className="flex items-center gap-3 sm:ms-auto">
          <LanguageSwitcher />
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
