import { validateRequest } from "@/auth";
import FollowButton from "@/components/FollowButton";
import FollowerCount from "@/components/FollowerCount";
import Linkify from "@/components/Linkify";
import TrendsSidebar from "@/components/TrendsSidebar";
import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { faIR } from "date-fns/locale/fa-IR";
import { enUS } from "date-fns/locale";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { type Locale } from "@/i18n/config";
import EditProfileButton from "./EditProfileButton";
import UserPosts from "./UserPosts";

/**
 * Format date based on locale
 * For Persian (fa), converts to Jalali calendar
 * For English (en), uses Gregorian calendar
 */
function formatDateByLocale(date: Date, locale: Locale): string {
  if (locale === "fa") {
    // Convert to Jalali calendar using JavaScript's built-in Persian locale
    // This automatically converts Gregorian to Jalali
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } else {
    // Use date-fns for English formatting
    return formatDate(date, "MMM d, yyyy", { locale: enUS });
  }
}

interface PageProps {
  params: Promise<{ username: string }>;
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  const { user: loggedInUser } = await validateRequest();
  const t = await getTranslations("errors");
  const tUser = await getTranslations("user");

  if (!loggedInUser) {
    return <p className="text-destructive">{t("notAuthorized")}</p>;
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {tUser("userPosts", { name: user.displayName })}
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const t = await getTranslations("user");
  const locale = (await getLocale()) as Locale;
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  // Format date with locale support (Jalali for Persian, Gregorian for English)
  const formattedDate = formatDateByLocale(user.createdAt, locale);

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <div className="text-muted-foreground">
              <span className="username" dir="ltr">
                @{user.username}
              </span>
            </div>
          </div>
          <div>
            {t("memberSince")} {formattedDate}
          </div>
          <div className="flex items-center gap-3">
            <span>
              {t("postsLabel")}{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  );
}
