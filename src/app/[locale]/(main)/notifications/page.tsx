import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import Notifications from "./Notifications";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function Page() {
  const t = useTranslations("common");
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">{t("notifications")}</h1>
        </div>
        <Notifications />
      </div>
      <TrendsSidebar />
    </main>
  );
}