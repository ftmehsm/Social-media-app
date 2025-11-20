"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

/**
 * Search Field Component
 * 
 * Provides a search input field with translation support.
 * The search icon position adapts to RTL/LTR direction automatically.
 */
export default function SearchField() {
  const router = useRouter();
  const t = useTranslations("common");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }
  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input
          name="q"
          type="text"
          placeholder={t("search")}
          className="pe-10"
        />
        <SearchIcon className="absolute ltr:right-3 rtl:left-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
