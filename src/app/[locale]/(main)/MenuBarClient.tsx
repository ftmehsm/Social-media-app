"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, Home } from "lucide-react";
import Link from "next/link";
import MessagesButton from "./MessagesButton";
import NotificationsButton from "./NotificationsButton";
import { useTranslations } from "next-intl";

interface MenuBarClientProps {
  className?: string;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
}

/**
 * Client Component for MenuBar
 * 
 * This component handles the menu bar navigation with translations.
 * It's separated from the server component to allow use of useTranslations hook.
 */
export default function MenuBarClient({
  className,
  unreadNotificationsCount,
  unreadMessagesCount,
}: MenuBarClientProps) {
  const t = useTranslations("common");

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title={t("home")}
        asChild
      >
        <Link href="/">
          <Home />
          <span className="hidden lg:inline">{t("home")}</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      <MessagesButton
        initialState={{ unreadCount: unreadMessagesCount }}
      />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title={t("bookmarks")}
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">{t("bookmarks")}</span>
        </Link>
      </Button>
    </div>
  );
}

