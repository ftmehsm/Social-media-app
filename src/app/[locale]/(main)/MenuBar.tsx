import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { Bookmark, Home } from "lucide-react";
import Link from "next/link";
import MessagesButton from "./MessagesButton";
import NotificationsButton from "./NotificationsButton";
import MenuBarClient from "./MenuBarClient";

interface MenuBarProps {
  className?: string;
}

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await validateRequest();

  if (!user) return null;

  // Ensure user exists in Stream Chat before getting unread count
  try {
    await streamServerClient.upsertUser({
      id: user.id,
      username: user.username,
      name: user.displayName,
      image: user.avatarUrl || undefined,
    });
  } catch (error) {
    console.error("Error upserting user in Stream Chat:", error);
  }

  const [unreadNotificationsCount, unreadMessagesCountResult] =
    await Promise.all([
      prisma.notification.count({
        where: {
          recipientId: user.id,
          read: false,
        },
      }),
      streamServerClient
        .getUnreadCount(user.id)
        .then((result) => result.total_unread_count)
        .catch((error) => {
          // Fallback to 0 if there's still an error
          console.error("Error getting unread count:", error);
          return 0;
        }),
    ]);

  return (
    <MenuBarClient
      className={className}
      unreadNotificationsCount={unreadNotificationsCount}
      unreadMessagesCount={unreadMessagesCountResult}
    />
  );
}
