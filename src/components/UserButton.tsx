"use client";

import { LogOutIcon, SunIcon, MoonIcon, UserIcon } from "lucide-react";
import { useSession } from "@/contexts/SessionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { logout } from "@/app/[locale]/(auth)/actions";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { isRTL, type Locale } from "@/i18n/config";

/**
 * UserButton Component
 *
 * Displays user avatar with dropdown menu containing:
 * - User info (logged in as @username)
 * - Profile link
 * - Theme toggle (Light/Dark mode)
 * - Logout option
 *
 * Supports RTL/LTR layouts and translations.
 */
interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const t = useTranslations("user");
  const locale = useLocale() as Locale;

  // Determine icon margin class based on RTL/LTR
  const iconMarginClass = isRTL(locale) ? "ml-2" : "mr-2";
  // Get direction for dropdown menu items
  const direction = isRTL(locale) ? "rtl" : "ltr";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex-none rounded-full border-none outline-none",
            className,
          )}
        >
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div dir={direction}>
          <DropdownMenuLabel>
            {t("loggedInAs")}{" "}
            <span className="username" dir="ltr">
              @{user.username}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href={`/users/${user.username}`}>
            <DropdownMenuItem>
              <UserIcon className={cn("size-4", iconMarginClass)} />
              {t("profile")}
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <SunIcon className={cn("size-4", iconMarginClass)} />
            ) : (
              <MoonIcon className={cn("size-4", iconMarginClass)} />
            )}
            {theme === "dark" ? t("lightMode") : t("darkMode")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              queryClient.clear();
              logout();
            }}
          >
            <LogOutIcon className={cn("size-4", iconMarginClass)} />
            {t("logout")}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
