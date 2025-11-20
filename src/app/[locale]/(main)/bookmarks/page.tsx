import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import Bookmarks from "./Bookmarks";
import BookmarksClient from "./BookmarksClient";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <BookmarksClient />
        <Bookmarks />
      </div>
      <TrendsSidebar />
    </main>
  );
}