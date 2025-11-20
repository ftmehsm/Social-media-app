"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import ForYouFeed from "./ForYouFeed";
import FollowingFeed from "./FollowingFeed";

/**
 * Home Tabs Component
 * 
 * Client component for the home page tabs (For You / Following).
 * Separated to allow use of useTranslations hook.
 */
export default function HomeTabs() {
  const t = useTranslations("posts");

  return (
    <Tabs defaultValue="for-you">
      <TabsList>
        <TabsTrigger value="for-you">{t("forYou")}</TabsTrigger>
        <TabsTrigger value="following">{t("following")}</TabsTrigger>
      </TabsList>
      <TabsContent value="for-you">
        <ForYouFeed />
      </TabsContent>
      <TabsContent value="following">
        <FollowingFeed />
      </TabsContent>
    </Tabs>
  );
}

