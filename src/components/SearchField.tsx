"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import useDebounce from "@/hooks/useDebounce";

/**
 * Search Field Component
 *
 * Provides a search input field with translation support.
 * The search icon position adapts to RTL/LTR direction automatically.
 * Searches automatically as user types with debouncing.
 */
export default function SearchField() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("common");
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const isInternalUpdate = useRef(false);

  // Update search value when URL changes externally (e.g., browser back/forward)
  useEffect(() => {
    if (!isInternalUpdate.current) {
      const urlQuery = searchParams.get("q") || "";
      if (urlQuery !== searchValue) {
        setSearchValue(urlQuery);
      }
    }
    isInternalUpdate.current = false;
  }, [searchParams]);

  useEffect(() => {
    const trimmedValue = debouncedSearchValue.trim();
    const currentQuery = searchParams.get("q") || "";

    // If input has value, navigate to search with query
    if (trimmedValue && trimmedValue !== currentQuery) {
      isInternalUpdate.current = true;
      router.push(`/search?q=${encodeURIComponent(trimmedValue)}`);
    }
    // If input is empty, redirect to home (don't stay on search page)
    else if (!trimmedValue) {
      // Only redirect if we're on search page or if there was a query
      if (pathname === "/search" || currentQuery) {
        isInternalUpdate.current = true;
        router.push("/");
      }
    }
  }, [debouncedSearchValue, router, searchParams, pathname]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Navigation is handled by useEffect with debounced value
    // But we can navigate immediately if user presses Enter
    const trimmedValue = searchValue.trim();
    if (trimmedValue) {
      router.push(`/search?q=${encodeURIComponent(trimmedValue)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input
          name="q"
          type="text"
          placeholder={t("search")}
          className="pe-10"
          value={searchValue}
          onChange={handleChange}
        />
        <SearchIcon className="absolute top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground ltr:right-3 rtl:left-3" />
      </div>
    </form>
  );
}
