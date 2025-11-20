"use client";

import { useFollowerInfo } from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { useTranslations } from "next-intl";

export interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowerCount({
  userId,
  initialState,
}: FollowerCountProps) {
  const { data } = useFollowerInfo(userId, initialState);
  const t = useTranslations("user");
  return (
    <span>
      {t("followers")}:{" "}
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </span>
  );
}
